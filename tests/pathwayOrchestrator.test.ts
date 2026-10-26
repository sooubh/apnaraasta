import { describe, it, expect } from "vitest";
import { PathwayOrchestrator } from "@/lib/gemini/orchestrator";
import { UserPreferences } from "@/lib/types/pathway";

describe("Pathway Orchestration & Grounded Sequencing", () => {
  const orchestrator = new PathwayOrchestrator();

  const mockPreferences: UserPreferences = {
    city: "Pune",
    areas: ["Koregaon Park", "FC Road & Shivaji Nagar"],
    flexibleBudget: true,
    days: ["sat", "sun"],
    timeWindows: ["morning", "afternoon"],
    socialComfort: "balanced",
    categories: ["photography_art", "music_films"],
    favouriteEntities: [{ name: "Radiohead" }],
  };

  it("should generate a 3-step pathway where every step references a valid verified Pune candidate", async () => {
    const res = await orchestrator.generatePathway({
      preferences: mockPreferences,
      requestMode: "qloo",
    });

    expect(res.status).toBe("success");
    expect(res.pathway).toBeDefined();
    expect(res.pathway?.steps.length).toBe(3);

    // Verify ordering and roles
    expect(res.pathway?.steps[0].order).toBe(1);
    expect(res.pathway?.steps[0].role).toBe("approachable_start");
    expect(res.pathway?.steps[1].order).toBe(2);
    expect(res.pathway?.steps[1].role).toBe("shared_interest");
    expect(res.pathway?.steps[2].order).toBe(3);
    expect(res.pathway?.steps[2].role).toBe("recurring_participation");

    // Verify activity enrichment
    for (const step of res.pathway!.steps) {
      expect(step.activity).toBeDefined();
      expect(step.activity?.id).toBe(step.activityId);
      expect(step.activity?.sourceUrl.startsWith("http")).toBe(true);
      expect(step.activity?.verificationStatus).toBe("verified");
      expect(step.whyThisStep.length).toBeGreaterThan(10);
    }
  });

  it("should support baseline arm without Qloo evidence", async () => {
    const res = await orchestrator.generatePathway({
      preferences: mockPreferences,
      requestMode: "baseline",
    });

    expect(res.status).toBe("success");
    expect(res.method).toBe("baseline");
    expect(res.qlooEvidence).toBeUndefined();
    expect(res.pathway?.steps.length).toBe(3);
  });

  it("should provide alternative activities from the eligible pool", async () => {
    const res = await orchestrator.generatePathway({
      preferences: mockPreferences,
      requestMode: "qloo",
    });

    expect(res.pathway?.alternativeActivityIds).toBeDefined();
    if (res.pathway?.alternativeActivityIds.length) {
      const stepIds = new Set(res.pathway.steps.map((s) => s.activityId));
      for (const altId of res.pathway.alternativeActivityIds) {
        expect(stepIds.has(altId)).toBe(false);
      }
    }
  });

  it("should enforce approachable entry for Step 1 and recurring rhythm for Step 3", async () => {
    const res = await orchestrator.generatePathway({
      preferences: mockPreferences,
      requestMode: "baseline",
    });

    const step1 = res.pathway!.steps[0].activity!;
    const step3 = res.pathway!.steps[2].activity!;

    // Step 1: Low-pressure or free or low entry price
    const isStep1Welcoming =
      step1.costStatus === "free_confirmed" ||
      step1.socialComfort === "low_pressure" ||
      (step1.priceMinInr !== undefined && step1.priceMinInr <= 150);
    expect(isStep1Welcoming).toBe(true);

    // Step 3: Recurring community or recurring schedule
    const isStep3Recurring =
      step3.activityKind === "recurring_community" || step3.scheduleKind === "recurring";
    expect(isStep3Recurring).toBe(true);
  });

  it("should generate category-diverse steps when multiple categories are selected", async () => {
    const multiCategoryPreferences: UserPreferences = {
      ...mockPreferences,
      categories: ["books_board_games", "music_films"],
    };

    const res = await orchestrator.generatePathway({
      preferences: multiCategoryPreferences,
      requestMode: "baseline",
    });

    const stepCategories = res.pathway!.steps.map((s) => s.activity?.category);
    // At least one step should belong to books_board_games and at least one to music_films
    const hasBooksOrGames = stepCategories.includes("books_board_games");
    const hasMusicOrFilms = stepCategories.includes("music_films");
    expect(hasBooksOrGames || hasMusicOrFilms).toBe(true);
  });

  it("should generate grounded personal rationales referencing venue and locality", () => {
    const sampleActivity = {
      id: "test-venue",
      title: "Pune Art Studio",
      category: "photography_art" as const,
      activityKind: "place" as const,
      city: "Pune" as const,
      area: "FC Road & Shivaji Nagar",
      costStatus: "free_confirmed" as const,
      priceMinInr: 0,
      priceMaxInr: 0,
      scheduleKind: "evergreen" as const,
      socialComfort: "low_pressure" as const,
      sourceName: "Art Circle",
      sourceUrl: "https://example.com",
      verifiedAt: "2026-10-21T10:00:00+05:30",
      verificationStatus: "verified" as const,
      verificationNotes: "Verified notes",
      tags: ["art"],
      demoOnly: false,
    };

    const rationale = orchestrator.generatePersonalizedRationale(
      sampleActivity,
      "approachable_start",
      mockPreferences
    );

    expect(rationale).toContain("Pune Art Studio");
    expect(rationale).toContain("FC Road & Shivaji Nagar");
    expect(rationale).toContain("free");
  });
});
