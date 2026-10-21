# Internal API Contracts

All route paths are internal application contracts; implement them with Next.js route handlers and keep provider secrets server-side. Validate requests and responses with a runtime schema library. Exact HTTP statuses may be chosen consistently during implementation, but documented error types must be preserved.

## 1. Shared types

```ts
export type ActivityCategory =
  | "music_films"
  | "photography_art"
  | "books_board_games"
  | "food_experiences"
  | "outdoor_activities"
  | "volunteering";

export type SocialComfort = "low_pressure" | "balanced" | "highly_social";
export type ScheduleKind = "recurring" | "date_specific" | "evergreen" | "unknown";
export type VerificationStatus = "verified" | "stale" | "demo_only" | "unverified";

export interface UserPreferences {
  city: "Pune";
  areas: string[];
  maxDistanceKm?: number;
  budgetMinInr?: number;
  budgetMaxInr?: number;
  flexibleBudget: boolean;
  days: Array<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun">;
  timeWindows: Array<"morning" | "afternoon" | "evening">;
  socialComfort: SocialComfort;
  categories: ActivityCategory[];
  favouriteEntities: Array<{ name: string; kind?: "artist" | "movie" | "book" | "person" | "brand" | "place"; qlooEntityId?: string }>;
}

export interface ActivityCardData {
  id: string;
  title: string;
  category: ActivityCategory;
  shortDescription: string;
  activityKind: "activity" | "recurring_community" | "place";
  area?: string;
  address?: string;
  distanceKm?: number;
  priceMinInr?: number;
  priceMaxInr?: number;
  costStatus: "known" | "free_confirmed" | "unknown";
  scheduleKind: ScheduleKind;
  scheduleText?: string;
  nextOccurrence?: string; // ISO-8601 only if source-verified
  socialComfort?: SocialComfort;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string; // ISO timestamp; source verification timestamp
  verificationStatus: VerificationStatus;
  imageUrl?: string;
  externalActionUrl?: string;
}
```

Do not return internal Qloo API key, raw response payload, private cache keys, raw provider errors or other user's records in any API response.

## 2. `POST /api/pathways/generate`

### Request

```json
{
  "preferences": {
    "city": "Pune",
    "areas": ["Koregaon Park", "Deccan"],
    "budgetMaxInr": 500,
    "flexibleBudget": false,
    "days": ["sat", "sun"],
    "timeWindows": ["morning", "afternoon"],
    "socialComfort": "low_pressure",
    "categories": ["photography_art", "music_films"],
    "favouriteEntities": [
      { "name": "Example artist", "kind": "artist" }
    ]
  },
  "excludeActivityIds": [],
  "requestMode": "qloo"
}
```

`requestMode` is `qloo` for the normal pathway. Do not allow the browser to provide arbitrary Qloo entity IDs as trusted data; server should resolve/validate them or confirm them against supported IDs.

### Successful response

```json
{
  "requestId": "opaque-id",
  "status": "success",
  "method": "qloo",
  "qlooStatus": "used",
  "qlooEvidence": {
    "resolvedEntities": [{ "name": "Example artist", "entityType": "urn:entity:artist" }],
    "explainabilityAvailable": true,
    "summary": "Signal contribution metadata was returned by Qloo."
  },
  "pathway": {
    "title": "A pathway into photography and music communities",
    "steps": [
      { "order": 1, "activityId": "verified-id-1", "whyThisStep": "Grounded explanation", "role": "approachable_start" },
      { "order": 2, "activityId": "verified-id-2", "whyThisStep": "Grounded explanation", "role": "shared_interest" },
      { "order": 3, "activityId": "verified-id-3", "whyThisStep": "Grounded explanation", "role": "recurring_participation" }
    ],
    "alternativeActivityIds": ["verified-id-4"]
  },
  "dataStatus": { "verifiedRecords": 3, "staleRecords": 0, "unknownFields": ["schedule"] }
}
```

The above is illustrative JSON, not fixed copy. Return activity details or references through a normalized response. `qlooEvidence.summary` must reflect actual status; don't return the sample string verbatim.

### Failure response

```json
{
  "requestId": "opaque-id",
  "status": "error",
  "error": {
    "code": "QLOO_EMPTY_RESULTS",
    "message": "We couldn't find enough cultural signals for this selection. Try another interest.",
    "retryable": true
  }
}
```

Use safe actionable user messages; provider errors must not leak secrets or full upstream payloads.

## 3. `POST /api/pathways/compare`

### Request

```json
{
  "preferences": { "city": "Pune", "categories": ["books_board_games"], "areas": [], "days": [], "timeWindows": [], "socialComfort": "balanced", "flexibleBudget": true, "favouriteEntities": [] },
  "comparisonRunId": "optional-client-generated-id"
}
```

### Response contract

Return both arms separately with status and provenance:

```json
{
  "requestId": "opaque-id",
  "candidatePoolId": "opaque-pool-hash",
  "baseline": { "status": "success", "method": "generic_gemini_without_qloo", "pathway": {} },
  "qloo": { "status": "success", "method": "gemini_with_actual_qloo_evidence", "qlooStatus": "used", "pathway": {} },
  "metrics": {
    "verifiedCandidateCount": 12,
    "baselineVerifiedSources": 3,
    "qlooVerifiedSources": 3,
    "baselineConstraintViolations": 0,
    "qlooConstraintViolations": 0,
    "categoryCoverage": { "baseline": 2, "qloo": 3 }
  },
  "comparisonDisclaimer": "These are results for the selected profile and current verified dataset; this is not a general accuracy benchmark."
}
```

Metrics must be computed from actual results; never hardcode values from this illustrative contract. If a step is missing, do not fabricate a complete arm. Only include supported metrics. Ensure baseline has no Qloo outputs. Same candidate pool and hard constraints are mandatory.

## 4. Error codes

Use stable internal codes such as:

- `INVALID_INPUT`
- `QLOO_AUTH_FAILED`
- `QLOO_UNSUPPORTED_ENTITY_TYPE`
- `QLOO_INVALID_PARAMETER`
- `QLOO_RATE_LIMITED`
- `QLOO_TIMEOUT`
- `QLOO_EMPTY_RESULTS`
- `GEMINI_TIMEOUT`
- `GEMINI_INVALID_OUTPUT`
- `NO_VERIFIED_CANDIDATES`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

Each error has `retryable` and a short safe message. Log detailed sanitized diagnostics on the server using a request ID.

## 5. Firestore persistence contract

Use the Firebase client SDK after Google sign-in for `users/{uid}/pathways/{pathwayId}` unless the implementation documents a justified alternative. Save only the normalized pathway, preference summary needed to display it, activity references/snapshots, provider method/provenance flags and `createdAt`. Do not save raw Qloo JSON, secrets or unrelated personal information.
