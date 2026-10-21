import { describe, it, expect } from "vitest";
import { QlooClient } from "@/lib/qloo/client";

describe("Qloo API Client Adapter", () => {
  it("should detect unconfigured state gracefully when API key is missing", async () => {
    const client = new QlooClient({ apiKey: "" });
    expect(client.isConfigured()).toBe(false);

    const entities = await client.searchEntities("Radiohead");
    expect(entities).toEqual([]);

    const tags = await client.searchTags("indie");
    expect(tags).toEqual([]);

    const insights = await client.getCulturalInsights({
      filterType: "urn:entity:place",
      locationQuery: "Pune",
    });

    expect(insights.status).toBe("error");
    expect(insights.entities).toEqual([]);
    expect(insights.summary).toContain("not configured");
  });

  it("should configure with default hackathon base URL", () => {
    const client = new QlooClient({ apiKey: "test_key" });
    expect(client.isConfigured()).toBe(true);
  });
});
