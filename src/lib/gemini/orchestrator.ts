import { GoogleGenAI } from "@google/genai";
import {
  ActivityCardData,
  Activity,
} from "../types/activity";
import {
  GeneratePathwayResponse,
  Pathway,
  PathwayStep,
  UserPreferences,
  QlooEvidence,
} from "../types/pathway";
import { PUNE_ACTIVITIES, filterApprovedActivities } from "../../data/puneActivities";
import { defaultQlooClient } from "../qloo/client";
import {
  MAX_AGENT_STEPS,
  MAX_ALTERNATIVES,
  MAX_CANDIDATES_FOR_RANKING,
} from "../constants";

export class PathwayOrchestrator {
  private geminiKey: string;
  private geminiModel: string;

  constructor() {
    this.geminiKey = process.env.GEMINI_API_KEY || "";
    this.geminiModel = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  }

  public isConfigured(): boolean {
    return Boolean(this.geminiKey && this.geminiKey.trim().length > 0);
  }

  /**
   * Deterministically assemble and score candidates
   */
  private scoreActivities(
    candidates: Activity[],
    preferences: UserPreferences,
    qlooPlaces: any[]
  ): Array<{ activity: Activity; score: number; matchReasons: string[] }> {
    return candidates.map((act) => {
      let score = 50; // base score
      const matchReasons: string[] = [];

      // 1. Category preference match
      if (preferences.categories.includes(act.category)) {
        score += 25;
        matchReasons.push(`Matches interest in ${act.category.replace("_", " ")}`);
      }

      // 2. Area match
      if (preferences.areas.length > 0 && act.area) {
        const matchesArea = preferences.areas.some(
          (a) => act.area?.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(act.area?.toLowerCase() || "")
        );
        if (matchesArea) {
          score += 20;
          matchReasons.push(`Conveniently located in ${act.area}`);
        }
      }

      // 3. Social comfort alignment
      if (act.socialComfort && act.socialComfort === preferences.socialComfort) {
        score += 15;
        matchReasons.push(`Matches preferred ${preferences.socialComfort.replace("_", " ")} social pace`);
      }

      // 4. Qloo Cultural Affinity Join
      if (qlooPlaces.length > 0) {
        const placeMatch = qlooPlaces.find((p) => {
          const actTitleLower = act.title.toLowerCase();
          const pNameLower = (p.name || "").toLowerCase();
          return (
            actTitleLower.includes(pNameLower) ||
            pNameLower.includes(actTitleLower) ||
            (act.tags && p.tags && act.tags.some((t: string) => p.tags.includes(t)))
          );
        });

        if (placeMatch) {
          const affinityBoost = placeMatch.affinity ? Math.round(placeMatch.affinity * 30) : 20;
          score += affinityBoost;
          matchReasons.push(`Cultural affinity signal identified via Qloo (${placeMatch.name})`);
        }
      }

      return { activity: act, score, matchReasons };
    });
  }

  /**
   * Generate 3-step pathway using Gemini agent workflow or deterministic backup
   */
  public async generatePathway(params: {
    preferences: UserPreferences;
    excludeActivityIds?: string[];
    requestMode?: "qloo" | "baseline";
  }): Promise<GeneratePathwayResponse> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const isBaseline = params.requestMode === "baseline";

    // Step 1: Deterministic candidate pool filtering
    const eligibleCandidates = filterApprovedActivities(PUNE_ACTIVITIES, {
      categories: params.preferences.categories,
      areas: params.preferences.areas,
      budgetMaxInr: params.preferences.budgetMaxInr,
      flexibleBudget: params.preferences.flexibleBudget,
      socialComfort: params.preferences.socialComfort,
      excludeIds: params.excludeActivityIds,
    });

    if (eligibleCandidates.length === 0) {
      return {
        requestId,
        status: "error",
        method: isBaseline ? "baseline" : "qloo",
        error: {
          code: "NO_VERIFIED_CANDIDATES",
          message: "No verified Pune activities matched your specific budget and area constraints. Try expanding your areas or adjusting the budget ceiling.",
          retryable: true,
        },
      };
    }

    // Step 2: Fetch Qloo cultural signals (ONLY in Qloo mode)
    let qlooEvidence: QlooEvidence | undefined = undefined;
    let qlooPlaces: any[] = [];
    let qlooStatus: "used" | "unavailable" | "partial" | "empty" = "unavailable";

    if (!isBaseline && defaultQlooClient.isConfigured()) {
      try {
        // Resolve favourite entities if any
        const resolvedEntities: Array<{ name: string; entityType: string; id?: string }> = [];
        const entityIds: string[] = [];

        for (const fav of params.preferences.favouriteEntities || []) {
          const searchRes = await defaultQlooClient.searchEntities(fav.name);
          if (searchRes.length > 0) {
            resolvedEntities.push({
              name: fav.name,
              entityType: searchRes[0].entityType,
              id: searchRes[0].id,
            });
            entityIds.push(searchRes[0].id);
          }
        }

        // Get insights for Pune
        const insights = await defaultQlooClient.getCulturalInsights({
          filterType: "urn:entity:place",
          locationQuery: "Pune",
          entityIds: entityIds.length > 0 ? entityIds : undefined,
          take: 20,
        });

        if (insights.status === "success" && insights.entities.length > 0) {
          qlooPlaces = insights.entities;
          qlooStatus = "used";
          qlooEvidence = {
            resolvedEntities,
            explainabilityAvailable: insights.explainabilityAvailable,
            summary: insights.summary,
            contributingSignals: insights.contributingSignals,
          };
        } else if (insights.status === "empty") {
          qlooStatus = "empty";
          qlooEvidence = {
            resolvedEntities,
            explainabilityAvailable: false,
            summary: "No direct place entities returned by Qloo for this specific signal set.",
          };
        }
      } catch (err) {
        console.warn("[Orchestrator] Qloo integration failed:", err);
        qlooStatus = "unavailable";
      }
    }

    // Step 3: Score candidates with constraints & signals
    const scored = this.scoreActivities(
      eligibleCandidates,
      params.preferences,
      isBaseline ? [] : qlooPlaces
    ).sort((a, b) => b.score - a.score);

    // Limit candidate pool size to MAX_CANDIDATES_FOR_RANKING
    const topCandidates = scored.slice(0, MAX_CANDIDATES_FOR_RANKING);

    // Step 4: Sequence 3-step pathway (approachable start -> shared interest -> recurring participation)
    let pathway: Pathway | null = null;

    if (this.isConfigured()) {
      pathway = await this.generateViaGemini({
        preferences: params.preferences,
        candidates: topCandidates.map((c) => c.activity),
        qlooEvidence,
        isBaseline,
      });
    }

    // Step 5: Fallback to deterministic sequencing if Gemini is unconfigured or failed validation
    if (!pathway) {
      pathway = this.deterministicSequencing(topCandidates, params.preferences);
    }

    // Enrich pathway steps and alternatives with full ActivityCardData
    const activityMap = new Map<string, Activity>(
      PUNE_ACTIVITIES.map((a) => [a.id, a])
    );

    pathway.steps.forEach((step) => {
      const act = activityMap.get(step.activityId);
      if (act) {
        step.activity = this.toCardData(act);
      }
    });

    pathway.alternatives = pathway.alternativeActivityIds
      .map((id) => activityMap.get(id))
      .filter((a): a is Activity => Boolean(a))
      .map((a) => this.toCardData(a));

    return {
      requestId,
      status: "success",
      method: isBaseline ? "baseline" : "qloo",
      qlooStatus: isBaseline ? undefined : qlooStatus,
      qlooEvidence: isBaseline ? undefined : qlooEvidence,
      pathway,
      dataStatus: {
        verifiedRecords: pathway.steps.length + (pathway.alternatives?.length || 0),
        staleRecords: 0,
        unknownFields: ["schedule_timing_exact"],
      },
    };
  }

  /**
   * Deterministic sequencing ensuring 3 steps + alternatives
   */
  private deterministicSequencing(
    scoredCandidates: Array<{ activity: Activity; score: number; matchReasons: string[] }>,
    preferences: UserPreferences
  ): Pathway {
    // 1. Approachable start: prefer low_pressure or free/introductory place/activity
    const step1Cand =
      scoredCandidates.find(
        (c) => c.activity.socialComfort === "low_pressure" || c.activity.costStatus === "free_confirmed"
      ) || scoredCandidates[0];

    // 2. Shared interest: choose from remaining with high interest match
    const remainingAfter1 = scoredCandidates.filter((c) => c.activity.id !== step1Cand.activity.id);
    const step2Cand =
      remainingAfter1.find(
        (c) => c.activity.category === preferences.categories[0] || c.activity.socialComfort === "balanced"
      ) || remainingAfter1[0] || step1Cand;

    // 3. Recurring participation: prefer recurring_community
    const remainingAfter2 = remainingAfter1.filter((c) => c.activity.id !== step2Cand.activity.id);
    const step3Cand =
      remainingAfter2.find(
        (c) => c.activity.activityKind === "recurring_community" || c.activity.scheduleKind === "recurring"
      ) || remainingAfter2[0] || step1Cand;

    // Alternatives: top remaining
    const usedIds = new Set([step1Cand.activity.id, step2Cand.activity.id, step3Cand.activity.id]);
    const alternativeIds = scoredCandidates
      .map((c) => c.activity.id)
      .filter((id) => !usedIds.has(id))
      .slice(0, MAX_ALTERNATIVES);

    const title = preferences.categories.length > 0
      ? `Your 3-Step Pathway into Pune's ${preferences.categories.map((c) => c.replace("_", " ")).join(" & ")} Communities`
      : "Your 3-Step Community Pathway in Pune";

    return {
      title,
      steps: [
        {
          order: 1,
          activityId: step1Cand.activity.id,
          role: "approachable_start",
          whyThisStep: `Begin with a gentle, low-pressure introduction at ${step1Cand.activity.title}. ${step1Cand.matchReasons.join(". ")}.`,
        },
        {
          order: 2,
          activityId: step2Cand.activity.id,
          role: "shared_interest",
          whyThisStep: `Deepen your participation around shared interests at ${step2Cand.activity.title}. ${step2Cand.matchReasons.join(". ")}.`,
        },
        {
          order: 3,
          activityId: step3Cand.activity.id,
          role: "recurring_participation",
          whyThisStep: `Build a lasting weekly or monthly rhythm with the ${step3Cand.activity.title} community. ${step3Cand.matchReasons.join(". ")}.`,
        },
      ],
      alternativeActivityIds: alternativeIds,
    };
  }

  /**
   * Gemini-powered bounded reasoning and grounded pathway construction
   */
  private async generateViaGemini(params: {
    preferences: UserPreferences;
    candidates: Activity[];
    qlooEvidence?: QlooEvidence;
    isBaseline: boolean;
  }): Promise<Pathway | null> {
    try {
      const ai = new GoogleGenAI({ apiKey: this.geminiKey });

      const candidateSummary = params.candidates.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        kind: c.activityKind,
        area: c.area,
        costStatus: c.costStatus,
        priceMin: c.priceMinInr,
        socialComfort: c.socialComfort,
        schedule: c.scheduleText,
      }));

      const prompt = `You are the lead cultural community planner for ApnaRaasta in Pune, India.
Given the verified Pune activity candidates below and user preferences, select exactly 3 sequential activities that form a realistic pathway from entry to community belonging:

Step 1 (approachable_start): Low-barrier, welcoming first visit.
Step 2 (shared_interest): Meaningful shared engagement around their interests.
Step 3 (recurring_participation): Regular recurring group or routine for lasting belonging.

Also select up to ${MAX_ALTERNATIVES} alternative activity IDs.

USER PREFERENCES:
- Categories: ${params.preferences.categories.join(", ")}
- Selected Areas: ${params.preferences.areas.join(", ") || "Any Pune area"}
- Budget Max: ${params.preferences.flexibleBudget ? "Flexible" : `₹${params.preferences.budgetMaxInr || "No limit"}`}
- Social Comfort: ${params.preferences.socialComfort}
${!params.isBaseline && params.qlooEvidence ? `- Qloo Cultural Signals: ${params.qlooEvidence.summary}` : ""}

AVAILABLE VERIFIED CANDIDATES (USE ONLY THESE IDs):
${JSON.stringify(candidateSummary, null, 2)}

REQUIREMENTS:
1. Return strictly valid JSON conforming to the schema below.
2. Every activityId MUST match one of the candidate IDs above. DO NOT invent or hallucinate IDs.
3. Ground the "whyThisStep" explanation strictly in factual details from the candidate and user preferences. No false promises.

JSON SCHEMA:
{
  "title": string,
  "steps": [
    { "order": 1, "activityId": string, "role": "approachable_start", "whyThisStep": string },
    { "order": 2, "activityId": string, "role": "shared_interest", "whyThisStep": string },
    { "order": 3, "activityId": string, "role": "recurring_participation", "whyThisStep": string }
  ],
  "alternativeActivityIds": string[]
}`;

      const res = await ai.models.generateContent({
        model: this.geminiModel,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const text = res.text || "";
      const parsed = JSON.parse(text);

      // Validate schema and ensure valid candidate IDs
      const validCandidateIds = new Set(params.candidates.map((c) => c.id));

      if (
        Array.isArray(parsed?.steps) &&
        parsed.steps.length === 3 &&
        parsed.steps.every((s: any) => validCandidateIds.has(s.activityId))
      ) {
        const validatedAlternatives = (parsed.alternativeActivityIds || []).filter(
          (id: string) =>
            validCandidateIds.has(id) &&
            !parsed.steps.some((s: any) => s.activityId === id)
        );

        return {
          title: parsed.title || "Your Curated Cultural Pathway in Pune",
          steps: parsed.steps.map((s: any, idx: number) => ({
            order: (idx + 1) as 1 | 2 | 3,
            activityId: s.activityId,
            role: s.role || (idx === 0 ? "approachable_start" : idx === 1 ? "shared_interest" : "recurring_participation"),
            whyThisStep: s.whyThisStep || "Selected based on your Pune cultural preferences.",
          })),
          alternativeActivityIds: validatedAlternatives.slice(0, MAX_ALTERNATIVES),
        };
      }

      console.warn("[Orchestrator] Gemini output failed ID or step count validation, using fallback");
      return null;
    } catch (err: any) {
      console.warn("[Orchestrator] Gemini call exception:", err?.message || err);
      return null;
    }
  }

  private toCardData(act: Activity): ActivityCardData {
    return {
      id: act.id,
      title: act.title,
      category: act.category,
      shortDescription: act.shortDescription,
      activityKind: act.activityKind,
      area: act.area,
      address: act.address,
      distanceKm: act.distanceKm,
      priceMinInr: act.priceMinInr,
      priceMaxInr: act.priceMaxInr,
      costStatus: act.costStatus,
      scheduleKind: act.scheduleKind,
      scheduleText: act.scheduleText,
      nextOccurrence: act.nextOccurrence,
      socialComfort: act.socialComfort,
      sourceName: act.sourceName,
      sourceUrl: act.sourceUrl,
      verifiedAt: act.verifiedAt,
      verificationStatus: act.verificationStatus,
      verificationNotes: act.verificationNotes,
      imageUrl: act.imageUrl,
      externalActionUrl: act.externalActionUrl || act.registrationUrl || act.sourceUrl,
    };
  }
}

export const defaultOrchestrator = new PathwayOrchestrator();
