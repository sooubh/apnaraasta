import { describe, it, expect } from "vitest";
import { z } from "zod";

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

describe("Contract Validation Schemas", () => {
  it("should validate legitimate user preferences", () => {
    const valid = {
      city: "Pune",
      areas: ["Koregaon Park"],
      flexibleBudget: true,
      days: ["sat", "sun"],
      timeWindows: ["morning"],
      socialComfort: "balanced",
      categories: ["music_films", "photography_art"],
      favouriteEntities: [{ name: "Radiohead" }],
    };

    const res = preferencesSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("should reject invalid non-Pune city", () => {
    const invalidCity = {
      city: "Mumbai",
      categories: ["music_films"],
    };

    const res = preferencesSchema.safeParse(invalidCity);
    expect(res.success).toBe(false);
  });

  it("should reject empty categories list", () => {
    const emptyCategories = {
      city: "Pune",
      categories: [],
    };

    const res = preferencesSchema.safeParse(emptyCategories);
    expect(res.success).toBe(false);
  });

  it("should reject unsupported category name", () => {
    const invalidCat = {
      city: "Pune",
      categories: ["nightlife_clubs"],
    };

    const res = preferencesSchema.safeParse(invalidCat);
    expect(res.success).toBe(false);
  });
});
