import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { defaultOrchestrator } from "@/lib/gemini/orchestrator";
import { GeneratePathwayRequest } from "@/lib/types/pathway";

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

const generateRequestSchema = z.object({
  preferences: preferencesSchema,
  excludeActivityIds: z.array(z.string()).default([]),
  requestMode: z.enum(["qloo", "baseline"]).default("qloo"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = generateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          requestId: `err_${Date.now()}`,
          status: "error",
          error: {
            code: "INVALID_INPUT",
            message: parsed.error.issues[0]?.message || "Invalid preference parameters provided.",
            retryable: false,
          },
        },
        { status: 400 }
      );
    }

    const payload: GeneratePathwayRequest = parsed.data;
    const result = await defaultOrchestrator.generatePathway(payload);

    if (result.status === "error") {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("[API generate] Unexpected exception:", err);
    return NextResponse.json(
      {
        requestId: `err_${Date.now()}`,
        status: "error",
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred while generating your pathway. Please try again.",
          retryable: true,
        },
      },
      { status: 500 }
    );
  }
}
