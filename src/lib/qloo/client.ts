import {
  NormalizedInsightResult,
  QlooInsightItem,
  QlooResolvedEntity,
  QlooResolvedTag,
} from "../types/qloo";
import { QLOO_HACKATHON_BASE_URL } from "../constants";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// In-memory private server-side cache (TTL: 15 minutes)
const serverCache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 15 * 60 * 1000;

function getCached<T>(key: string): T | null {
  const entry = serverCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    serverCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  serverCache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

export class QlooClient {
  private apiKey: string;
  private baseUrl: string;
  private timeoutMs: number;

  constructor(options?: { apiKey?: string; baseUrl?: string; timeoutMs?: number }) {
    this.apiKey = options?.apiKey || process.env.QLOO_API_KEY || "";
    this.baseUrl = (options?.baseUrl || process.env.QLOO_BASE_URL || QLOO_HACKATHON_BASE_URL).replace(/\/$/, "");
    this.timeoutMs = options?.timeoutMs || 8000;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Search and resolve entities by query and entity types
   */
  public async searchEntities(
    query: string,
    types?: string[]
  ): Promise<QlooResolvedEntity[]> {
    if (!this.isConfigured()) {
      return [];
    }

    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    const cacheKey = `qloo:search:${cleanQuery}:${(types || []).join(",")}`;
    const cached = getCached<QlooResolvedEntity[]>(cacheKey);
    if (cached) return cached;

    const url = new URL(`${this.baseUrl}/search`);
    url.searchParams.set("query", cleanQuery);
    if (types && types.length > 0) {
      url.searchParams.set("types", types.join(","));
    }

    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "X-Api-Key": this.apiKey,
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const elapsed = Date.now() - startTime;

      if (!res.ok) {
        console.warn(`[Qloo Search] Error status=${res.status} elapsed=${elapsed}ms`);
        return [];
      }

      const json = await res.json();
      const items = Array.isArray(json?.results)
        ? json.results
        : Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.entities)
        ? json.entities
        : [];

      const resolved: QlooResolvedEntity[] = items.map((item: any) => ({
        id: item.id || item.entity_id || item.urn || String(item._id || ""),
        name: item.name || item.title || cleanQuery,
        entityType: item.type || item.entity_type || types?.[0] || "urn:entity:artist",
        category: item.category || item.genre,
        score: typeof item.score === "number" ? item.score : undefined,
      })).filter((e: QlooResolvedEntity) => Boolean(e.id && e.name));

      setCache(cacheKey, resolved);
      return resolved;
    } catch (err: any) {
      console.warn(`[Qloo Search] Network or parsing failure: ${err?.message || "Unknown error"}`);
      return [];
    }
  }

  /**
   * Resolve tags via /v2/tags
   */
  public async searchTags(query: string): Promise<QlooResolvedTag[]> {
    if (!this.isConfigured()) return [];

    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    const cacheKey = `qloo:tags:${cleanQuery}`;
    const cached = getCached<QlooResolvedTag[]>(cacheKey);
    if (cached) return cached;

    const url = new URL(`${this.baseUrl}/v2/tags`);
    url.searchParams.set("query", cleanQuery);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "X-Api-Key": this.apiKey,
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (!res.ok) return [];

      const json = await res.json();
      const items = Array.isArray(json?.tags)
        ? json.tags
        : Array.isArray(json?.data)
        ? json.data
        : [];

      const resolved: QlooResolvedTag[] = items.map((t: any) => ({
        id: t.id || t.tag_id || String(t._id || ""),
        name: t.name || t.tag || cleanQuery,
        type: t.type,
      })).filter((t: QlooResolvedTag) => Boolean(t.id));

      setCache(cacheKey, resolved);
      return resolved;
    } catch {
      return [];
    }
  }

  /**
   * Get cultural insights from Qloo /v2/insights
   */
  public async getCulturalInsights(params: {
    filterType?: string;
    locationQuery?: string;
    entityIds?: string[];
    tagIds?: string[];
    take?: number;
  }): Promise<NormalizedInsightResult> {
    const filterType = params.filterType || "urn:entity:place";
    const locationQuery = params.locationQuery || "Pune";
    const take = Math.min(params.take || 20, 50);

    const startTime = Date.now();
    const requestId = `qloo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (!this.isConfigured()) {
      return {
        requestId,
        status: "error",
        filterType,
        locationQuery,
        entities: [],
        explainabilityAvailable: false,
        contributingSignals: [],
        summary: "Qloo API key is not configured in environment.",
        elapsedMs: 0,
      };
    }

    const cacheKey = `qloo:insights:${filterType}:${locationQuery}:${(params.entityIds || []).join(",")}:${(params.tagIds || []).join(",")}:${take}`;
    const cached = getCached<NormalizedInsightResult>(cacheKey);
    if (cached) {
      return { ...cached, requestId };
    }

    const url = new URL(`${this.baseUrl}/v2/insights`);
    url.searchParams.set("filter.type", filterType);
    url.searchParams.set("filter.location.query", locationQuery);
    url.searchParams.set("feature.explainability", "true");
    url.searchParams.set("take", String(take));

    if (params.entityIds && params.entityIds.length > 0) {
      url.searchParams.set("signal.interests.entities", params.entityIds.join(","));
    }
    if (params.tagIds && params.tagIds.length > 0) {
      url.searchParams.set("signal.interests.tags", params.tagIds.join(","));
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "X-Api-Key": this.apiKey,
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const elapsedMs = Date.now() - startTime;

      if (!res.ok) {
        console.warn(`[Qloo Insights] Failed status=${res.status} elapsed=${elapsedMs}ms`);
        return {
          requestId,
          status: "error",
          filterType,
          locationQuery,
          entities: [],
          explainabilityAvailable: false,
          contributingSignals: [],
          summary: `Qloo API responded with HTTP ${res.status}`,
          elapsedMs,
        };
      }

      const json = await res.json();
      const rawEntities = Array.isArray(json?.results)
        ? json.results
        : Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.entities)
        ? json.entities
        : [];

      let explainabilityFound = false;
      const contributingSignals: string[] = [];

      const entities: QlooInsightItem[] = rawEntities.map((item: any) => {
        let affinity: number | undefined = undefined;
        if (typeof item.affinity === "number") affinity = item.affinity;
        else if (typeof item.score === "number") affinity = item.score;
        else if (typeof item.affinity_score === "number") affinity = item.affinity_score;

        let explainability: any = undefined;
        if (item.explainability || item.contributing_signals) {
          explainabilityFound = true;
          const signals = item.explainability?.contributing_signals || item.contributing_signals || [];
          if (Array.isArray(signals)) {
            signals.forEach((s: any) => {
              const name = s.name || s.title || s.id;
              if (name && !contributingSignals.includes(name)) {
                contributingSignals.push(name);
              }
            });
          }
          explainability = {
            contributingSignals: signals,
          };
        }

        return {
          id: item.id || item.entity_id || item.urn || String(item._id || ""),
          name: item.name || item.title || "Unnamed Cultural Entity",
          entityType: item.type || item.entity_type || filterType,
          affinity,
          tags: Array.isArray(item.tags) ? item.tags : undefined,
          location: item.location
            ? {
                city: item.location.city,
                neighborhood: item.location.neighborhood || item.location.area,
                address: item.location.address,
                latitude: item.location.latitude || item.location.lat,
                longitude: item.location.longitude || item.location.lon,
              }
            : undefined,
          explainability,
        };
      });

      const result: NormalizedInsightResult = {
        requestId,
        status: entities.length > 0 ? "success" : "empty",
        filterType,
        locationQuery,
        entities,
        explainabilityAvailable: explainabilityFound,
        contributingSignals,
        summary: entities.length > 0
          ? `Discovered ${entities.length} cultural place and venue signals in ${locationQuery}.`
          : `No direct place entities returned for ${locationQuery} with current signals.`,
        elapsedMs,
      };

      setCache(cacheKey, result);
      return result;
    } catch (err: any) {
      const elapsedMs = Date.now() - startTime;
      console.warn(`[Qloo Insights] Exception: ${err?.message || "Timeout or network failure"}`);
      return {
        requestId,
        status: "error",
        filterType,
        locationQuery,
        entities: [],
        explainabilityAvailable: false,
        contributingSignals: [],
        summary: "Timeout or network error connecting to Qloo service.",
        elapsedMs,
      };
    }
  }
}

export const defaultQlooClient = new QlooClient();
