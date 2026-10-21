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
  PathwayStepRole,
} from "../types/pathway";
import { PUNE_ACTIVITIES, filterApprovedActivities } from "../../data/puneActivities";
import { defaultQlooClient } from "../qloo/client";
import {
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
   * Craft human, personal, and grounded match reasoning
   */
  private generatePersonalizedRationale(
    act: Activity,
    role: PathwayStepRole,
    preferences: UserPreferences,
    qlooMatch?: any
  ): string {
    const locality = act.area ? `in ${act.area}` : "in Pune";
    const favName = preferences.favouriteEntities?.[0]?.name;

    if (role === "approachable_start") {
      let text = `Start your journey ${locality} at ${act.title}. `;
      if (act.costStatus === "free_confirmed") {
        text += "It is completely free and unpretentious—an easy, welcoming setting to drop by on a weekend without any performance pressure. ";
      } else {
        text += "It offers a quiet, relaxed atmosphere designed for newcomers to simply settle in and absorb the room. ";
      }

      if (preferences.socialComfort === "low_pressure") {
        text += "There are no forced icebreakers or spotlight moments; you can participate purely at your own pace.";
      } else {
        text += "The hosts are welcoming and it gives you an effortless way to start feeling at home.";
      }
      return text;
    }

    if (role === "shared_interest") {
      let text = `Step deeper into Pune's creative community at ${act.title}. `;
      if (qlooMatch) {
        text += `The creative energy and indie focus here shares a natural kinship with your appreciation for ${favName || "distinctive cultural spaces"}. `;
      } else {
        text += "Here, conversations happen naturally around a focused shared activity rather than awkward small talk. ";
      }

      if (act.scheduleText) {
        text += `With sessions held ${act.scheduleText.toLowerCase()}, it fits seamlessly into a weekend rhythm.`;
      } else {
        text += "You will find dedicated enthusiasts who genuinely care about the craft.";
      }
      return text;
    }

    // recurring_participation
    let text = `Build a lasting weekly habit with ${act.title}. `;
    if (act.activityKind === "recurring_community" || act.scheduleKind === "recurring") {
      text += "This is a recurring circle that meets on a regular schedule, where familiar faces quickly turn into regular friends and weekend plans. ";
    } else {
      text += "This serves as your regular anchor point in the city whenever you want inspiring company. ";
    }

    if (preferences.socialComfort === "highly_social") {
      text += "It is collaborative, vibrant, and always welcomes fresh energy.";
    } else {
      text += "It offers a reliable, low-stress community routine you can return to week after week.";
    }
    return text;
  }

  /**
   * Score activities based on user preferences and cultural signals
   */
  private scoreActivities(
    candidates: Activity[],
    preferences: UserPreferences,
    qlooPlaces: any[]
  ): Array<{ activity: Activity; score: number; qlooMatch?: any }> {
    return candidates.map((act) => {
      let score = 50;
      let qlooMatch: any = undefined;

      // 1. Primary category match
      if (preferences.categories.includes(act.category)) {
        score += 30;
      }

      // 2. Area preference
      if (preferences.areas.length > 0 && act.area) {
        const matchesArea = preferences.areas.some(
          (a) =>
            act.area?.toLowerCase().includes(a.toLowerCase()) ||
            a.toLowerCase().includes(act.area?.toLowerCase() || "")
        );
        if (matchesArea) {
          score += 25;
        }
      }

      // 3. Social comfort
      if (act.socialComfort && act.socialComfort === preferences.socialComfort) {
        score += 15;
      }

      // 4. Qloo Cultural Affinity
      if (qlooPlaces.length > 0) {
        const match = qlooPlaces.find((p) => {
          const actTitleLower = act.title.toLowerCase();
          const pNameLower = (p.name || "").toLowerCase();
          return (
            actTitleLower.includes(pNameLower) ||
            pNameLower.includes(actTitleLower) ||
            (act.tags && p.tags && act.tags.some((t: string) => p.tags.includes(t)))
          );
        });

        if (match) {
          qlooMatch = match;
          score += 25;
        }
      }

      return { activity: act, score, qlooMatch };
    });
  }

  /**
   * Generate 3-step pathway
   */
  public async generatePathway(params: {
    preferences: UserPreferences;
    excludeActivityIds?: string[];
    requestMode?: "qloo" | "baseline";
  }): Promise<GeneratePathwayResponse> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const isBaseline = params.requestMode === "baseline";

    // Step 1: Candidate pool filtering with graceful fallbacks so users never get dead ends
    let eligibleCandidates = filterApprovedActivities(PUNE_ACTIVITIES, {
      categories: params.preferences.categories,
      areas: params.preferences.areas,
      budgetMaxInr: params.preferences.budgetMaxInr,
      flexibleBudget: params.preferences.flexibleBudget,
      socialComfort: params.preferences.socialComfort,
      excludeIds: params.excludeActivityIds,
    });

    // If strictly constrained search yielded too few records, broaden gently
    if (eligibleCandidates.length < 3) {
      const broaderCandidates = filterApprovedActivities(PUNE_ACTIVITIES, {
        categories: params.preferences.categories,
        flexibleBudget: true,
        excludeIds: params.excludeActivityIds,
      });

      const uniqueIds = new Set(eligibleCandidates.map((c) => c.id));
      for (const b of broaderCandidates) {
        if (!uniqueIds.has(b.id)) {
          eligibleCandidates.push(b);
          uniqueIds.add(b.id);
        }
      }
    }

    // Absolute fallback: ensure at least 3 candidates from all verified Pune activities
    if (eligibleCandidates.length < 3) {
      const remaining = PUNE_ACTIVITIES.filter((a) => !eligibleCandidates.some((e) => e.id === a.id));
      eligibleCandidates = [...eligibleCandidates, ...remaining].slice(0, 8);
    }

    // Step 2: Fetch Qloo cultural signals (ONLY in Qloo mode)
    let qlooEvidence: QlooEvidence | undefined = undefined;
    let qlooPlaces: any[] = [];
    let qlooStatus: "used" | "unavailable" | "partial" | "empty" = "unavailable";

    if (!isBaseline && defaultQlooClient.isConfigured()) {
      try {
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

    const topCandidates = scored.slice(0, MAX_CANDIDATES_FOR_RANKING);

    // Step 4: Sequence 3-step pathway
    let pathway: Pathway | null = null;

    if (this.isConfigured()) {
      // Use race with 4.5s timeout so the user is never kept waiting
      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 4500)
      );

      pathway = await Promise.race([
        this.generateViaGemini({
          preferences: params.preferences,
          candidates: topCandidates.map((c) => c.activity),
          qlooEvidence,
          isBaseline,
        }),
        timeoutPromise,
      ]);
    }

    // Step 5: Deterministic personal sequencing if AI was unconfigured, timed out, or unneeded
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
   * Deterministic sequencing ensuring 3 steps + alternatives with rich personal rationales
   */
  private deterministicSequencing(
    scoredCandidates: Array<{ activity: Activity; score: number; qlooMatch?: any }>,
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

    const categoryNames = preferences.categories.map((c) => c.replace("_", " "));
    const formattedCategories =
      categoryNames.length === 1
        ? categoryNames[0]
        : categoryNames.slice(0, -1).join(", ") + " & " + categoryNames.slice(-1);

    const title = `Your 3-Step Pathway into Pune's ${formattedCategories} Community`;

    return {
      title,
      steps: [
        {
          order: 1,
          activityId: step1Cand.activity.id,
          role: "approachable_start",
          whyThisStep: this.generatePersonalizedRationale(
            step1Cand.activity,
            "approachable_start",
            preferences,
            step1Cand.qlooMatch
          ),
        },
        {
          order: 2,
          activityId: step2Cand.activity.id,
          role: "shared_interest",
          whyThisStep: this.generatePersonalizedRationale(
            step2Cand.activity,
            "shared_interest",
            preferences,
            step2Cand.qlooMatch
          ),
        },
        {
          order: 3,
          activityId: step3Cand.activity.id,
          role: "recurring_participation",
          whyThisStep: this.generatePersonalizedRationale(
            step3Cand.activity,
            "recurring_participation",
            preferences,
            step3Cand.qlooMatch
          ),
        },
      ],
      alternativeActivityIds: alternativeIds,
    };
  }

  /**
   * Gemini reasoning
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

      const prompt = `You are a thoughtful local cultural curator for ApnaRaasta in Pune, India.
Given the verified Pune activity candidates below and user preferences, select exactly 3 sequential activities that form a warm, realistic, personal pathway:

Step 1 (approachable_start): Low-barrier, welcoming first visit.
Step 2 (shared_interest): Meaningful shared engagement around their interests.
Step 3 (recurring_participation): Regular recurring group or routine for lasting belonging.

Also select up to ${MAX_ALTERNATIVES} alternative activity IDs.

USER PREFERENCES:
- Categories: ${params.preferences.categories.join(", ")}
- Selected Areas: ${params.preferences.areas.join(", ") || "Any Pune area"}
- Budget Max: ${params.preferences.flexibleBudget ? "Flexible" : `₹${params.preferences.budgetMaxInr || "No limit"}`}
- Social Comfort: ${params.preferences.socialComfort}
${!params.isBaseline && params.qlooEvidence ? `- Cultural Signals: ${params.qlooEvidence.summary}` : ""}

AVAILABLE VERIFIED CANDIDATES (USE ONLY THESE IDs):
${JSON.stringify(candidateSummary, null, 2)}

REQUIREMENTS:
1. Return strictly valid JSON conforming to the schema below.
2. Every activityId MUST match one of the candidate IDs above. DO NOT invent IDs.
3. Write warm, personal, grounded rationales for whyThisStep without robotic jargon or marketing buzzwords.

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

      return null;
    } catch {
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
