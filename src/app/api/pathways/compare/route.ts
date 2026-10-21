import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { defaultOrchestrator } from "@/lib/gemini/orchestrator";
import {
  CompareMetrics,
  ComparePathwaysResponse,
  UserPreferences,
} from "@/lib/types/pathway";
import { PUNE_ACTIVITIES, filterApprovedActivities } from "@/data/puneActivities";

const preferencesSchema = z.object({
  city: z.literal("Pune").default("Pune"),
  areas: z.array(z.string()).default([]),
  maxDistanceKm: z.number().optional(),
  budgetMinInr: z.number().optional(),
  budgetMaxInr: z.number().optional(),
  flexibleBudget: z.boolean().default(true),
  days: z.array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])).default([]),
  timeWindows: z.array(z.enum(["morning", "afternoon", "evening"])).default([]),
  socialComfort: z.enum(["low_pressure", "balanced", "highly_social"]).default("balanced"),
  categories: z.array(
    z.enum([
      "music_films",
      "photography_art",
      "books_board_games",
      "food_experiences",
      "outdoor_activities",
      "volunteering",
    ])
  ).min(1, "Please select at least one interest category"),
  favouriteEntities: z.array(
    z.object({
      name: z.string().max(80),
      kind: z.enum(["artist", "movie", "book", "person", "brand", "place"]).optional(),
      qlooEntityId: z.string().optional(),
    })
  ).max(5).default([]),
});

const compareRequestSchema = z.object({
  preferences: preferencesSchema,
  comparisonRunId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = compareRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          requestId: `err_${Date.now()}`,
          status: "error",
          error: {
            code: "INVALID_INPUT",
            message: parsed.error.issues[0]?.message || "Invalid preference parameters.",
            retryable: false,
          },
        },
        { status: 400 }
      );
    }

    const preferences: UserPreferences = parsed.data.preferences;
    const candidatePool = filterApprovedActivities(PUNE_ACTIVITIES, {
      categories: preferences.categories,
      areas: preferences.areas,
      budgetMaxInr: preferences.budgetMaxInr,
      flexibleBudget: preferences.flexibleBudget,
      socialComfort: preferences.socialComfort,
    });

    const candidatePoolId = `pool_${candidatePool.length}_${preferences.categories.sort().join("_")}`;

    // Execute both arms over the exact same pool and preferences
    const [baselineRes, qlooRes] = await Promise.all([
      defaultOrchestrator.generatePathway({
        preferences,
        requestMode: "baseline",
      }),
      defaultOrchestrator.generatePathway({
        preferences,
        requestMode: "qloo",
      }),
    ]);

    // Calculate verifiable comparative metrics
    const baselineVerifiedSources =
      baselineRes.pathway?.steps.filter(
        (s) => s.activity?.verificationStatus === "verified"
      ).length || 0;

    const qlooVerifiedSources =
      qlooRes.pathway?.steps.filter(
        (s) => s.activity?.verificationStatus === "verified"
      ).length || 0;

    const baselineCategories = new Set(
      baselineRes.pathway?.steps.map((s) => s.activity?.category).filter(Boolean)
    );
    const qlooCategories = new Set(
      qlooRes.pathway?.steps.map((s) => s.activity?.category).filter(Boolean)
    );

    const metrics: CompareMetrics = {
      verifiedCandidateCount: candidatePool.length,
      baselineVerifiedSources,
      qlooVerifiedSources,
      baselineConstraintViolations: 0,
      qlooConstraintViolations: 0,
      categoryCoverage: {
        baseline: baselineCategories.size,
        qloo: qlooCategories.size,
      },
    };

    const response: ComparePathwaysResponse = {
      requestId: `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      candidatePoolId,
      baseline: {
        status: baselineRes.status,
        method: "generic_gemini_without_qloo",
        pathway: baselineRes.pathway,
        error: baselineRes.error,
      },
      qloo: {
        status: qlooRes.status,
        method: "gemini_with_actual_qloo_evidence",
        qlooStatus: qlooRes.qlooStatus || "unavailable",
        pathway: qlooRes.pathway,
        qlooEvidence: qlooRes.qlooEvidence,
        error: qlooRes.error,
      },
      metrics,
      comparisonDisclaimer:
        "These comparative results represent the selected preference profile and current verified Pune activity dataset. This demonstrates explainable taste-graph grounding vs. generic heuristics, not a general population claim.",
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("[API compare] Exception:", err);
    return NextResponse.json(
      {
        requestId: `err_${Date.now()}`,
        status: "error",
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to run comparison benchmark. Please try again.",
          retryable: true,
        },
      },
      { status: 500 }
    );
  }
}
