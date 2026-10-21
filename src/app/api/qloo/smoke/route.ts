import { NextResponse } from "next/server";
import { defaultQlooClient } from "@/lib/qloo/client";

export async function GET() {
  const isConfigured = defaultQlooClient.isConfigured();

  if (!isConfigured) {
    return NextResponse.json({
      configured: false,
      message: "QLOO_API_KEY is not set in environment.",
      searchSmoke: null,
      insightsSmoke: null,
    });
  }

  const startTime = Date.now();

  // Test 1: Search Entities (/search)
  const searchResults = await defaultQlooClient.searchEntities("Radiohead", [
    "urn:entity:artist",
  ]);

  // Test 2: Cultural Insights (/v2/insights)
  const insightsResult = await defaultQlooClient.getCulturalInsights({
    filterType: "urn:entity:place",
    locationQuery: "Pune",
    take: 5,
  });

  const totalElapsedMs = Date.now() - startTime;

  return NextResponse.json({
    configured: true,
    totalElapsedMs,
    searchSmoke: {
      endpoint: "/search",
      query: "Radiohead",
      type: "urn:entity:artist",
      returnedCount: searchResults.length,
      sampleEntityName: searchResults[0]?.name || null,
      sampleEntityType: searchResults[0]?.entityType || null,
    },
    insightsSmoke: {
      endpoint: "/v2/insights",
      filterType: insightsResult.filterType,
      locationQuery: insightsResult.locationQuery,
      status: insightsResult.status,
      returnedCount: insightsResult.entities.length,
      explainabilityAvailable: insightsResult.explainabilityAvailable,
      elapsedMs: insightsResult.elapsedMs,
      summary: insightsResult.summary,
    },
  });
}
