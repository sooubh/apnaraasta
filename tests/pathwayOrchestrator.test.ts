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
});
