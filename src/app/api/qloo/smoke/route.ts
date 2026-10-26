import { NextResponse } from "next/server";
import { defaultQlooClient } from "@/lib/qloo/client";

export async function GET() {
  const isConfigured = defaultQlooClient.isConfigured();
  const rawKey = process.env.QLOO_API_KEY?.trim() || "";
  const baseUrl = process.env.QLOO_BASE_URL || "https://hackathon.api.qloo.com";

  if (!isConfigured) {
    return NextResponse.json({
      configured: false,
      status: "unconfigured",
      baseUrl,
      maskedKey: null,
      message: "QLOO_API_KEY is not configured in .env.local",
      searchSmoke: null,
      insightsSmoke: null,
      totalElapsedMs: 0,
    });
  }

  const maskedKey = rawKey.length > 6
    ? `••••${rawKey.slice(-4)}`
    : "••••";

  const startTime = Date.now();

  try {
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
    const isSuccess = searchResults.length > 0 || insightsResult.entities.length > 0;

    return NextResponse.json({
      configured: true,
      status: isSuccess ? "success" : "partial",
      baseUrl,
      maskedKey,
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
  } catch (err: any) {
    const totalElapsedMs = Date.now() - startTime;
    return NextResponse.json(
      {
        configured: true,
        status: "error",
        baseUrl,
        maskedKey,
        totalElapsedMs,
        error: err?.message || "Failed calling Qloo API",
      },
      { status: 502 }
    );
  }
}
