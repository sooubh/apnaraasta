import { describe, it, expect } from "vitest";
import { PUNE_ACTIVITIES, filterApprovedActivities } from "@/data/puneActivities";

describe("Pune Activity Dataset & Deterministic Filters", () => {
  it("should have all activities marked as verified with sourceUrl and sourceName", () => {
    expect(PUNE_ACTIVITIES.length).toBeGreaterThanOrEqual(15);

    for (const act of PUNE_ACTIVITIES) {
      expect(act.city).toBe("Pune");
      expect(act.verificationStatus).toBe("verified");
      expect(act.demoOnly).toBe(false);
      expect(act.sourceName).toBeDefined();
      expect(act.sourceUrl.startsWith("http")).toBe(true);
      expect(act.verifiedAt).toBeDefined();
    }
  });

  it("should cover all 6 approved categories with at least 2 records each", () => {
    const requiredCategories = [
      "music_films",
      "photography_art",
      "books_board_games",
      "food_experiences",
      "outdoor_activities",
      "volunteering",
    ];

    for (const cat of requiredCategories) {
      const records = PUNE_ACTIVITIES.filter((a) => a.category === cat);
      expect(records.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("should filter deterministically by category", () => {
    const filtered = filterApprovedActivities(PUNE_ACTIVITIES, {
      categories: ["books_board_games"],
    });

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((a) => a.category === "books_board_games")).toBe(true);
  });

  it("should enforce strict budget ceilings when flexibleBudget is false", () => {
    const freeOnly = filterApprovedActivities(PUNE_ACTIVITIES, {
      flexibleBudget: false,
      budgetMaxInr: 0,
    });

    expect(freeOnly.length).toBeGreaterThan(0);
    for (const act of freeOnly) {
      if (act.costStatus === "known") {
        expect(act.priceMinInr).toBe(0);
      }
    }
  });

  it("should exclude specific activity IDs on regeneration or alternative selection", () => {
    const allBooks = filterApprovedActivities(PUNE_ACTIVITIES, {
      categories: ["books_board_games"],
    });
    const firstId = allBooks[0].id;

    const excluded = filterApprovedActivities(PUNE_ACTIVITIES, {
      categories: ["books_board_games"],
      excludeIds: [firstId],
    });

    expect(excluded.some((a) => a.id === firstId)).toBe(false);
  });
});
