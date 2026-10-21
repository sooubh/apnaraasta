# Data Model and Source Provenance

## 1. Activity model

The activity catalogue is the source of truth for factual local activity details. Keep it separate from Qloo raw responses and generated text.

Required record fields:

| Field | Meaning / rule |
|---|---|
| `id` | Stable internal ID; no secrets. |
| `title` | Source-grounded activity/place/community name. |
| `category` | One approved category. |
| `activityKind` | `activity`, `recurring_community`, or `place`. |
| `shortDescription` | Factual description supported by cited source, or careful neutral copy. |
| `city` | Must be Pune for current MVP. |
| `area`, `address` | Populate only when source-verified. |
| `coordinates` | Optional; only from a reliable source and only if distance calculation is used. Do not require precise user GPS. |
| `costStatus` | `known`, `free_confirmed`, or `unknown`. “Unknown” is not the same as free. |
| `priceMinInr`, `priceMaxInr` | Only if current source supports them. Record currency as INR. |
| `scheduleKind` | `recurring`, `date_specific`, `evergreen`, or `unknown`. |
| `scheduleText`, `nextOccurrence` | Exact schedule only when the source verifies it. `nextOccurrence` must be ISO date/time plus a valid timezone/interpretation. |
| `socialComfort` | Optional curated classification; document the basis. Do not infer without evidence. |
| `sourceName`, `sourceUrl` | Required. Use the original organizer/venue page where possible. |
| `verifiedAt` | Timestamp when the source was last checked by the project. Not the event date. |
| `verificationStatus` | `verified`, `stale`, `demo_only`, or `unverified`. Only `verified` may be shown as a current real recommendation by default. |
| `verificationNotes` | Brief note stating which fields were confirmed and which remain unknown. |
| `registrationUrl` | Optional external action only if source-verified. No in-app booking. |
| `imageUrl`, `imageSourceUrl`, `imageUsageNotes` | Optional. Must be a relevant/usable image; don't present generic stock as the actual venue/event. |
| `qlooEntityRefs` | Optional list of Qloo entity IDs/types that informed a match; references only, not raw payloads. |
| `tags` | Internal normalized category/preferences tags; don't claim these are Qloo tag IDs unless they really are. |
| `demoOnly` | Boolean marker for fixtures; demo records never mix into verified production candidate list. |

Suggested local file shape:

```json
{
  "id": "pune-photo-walk-example",
  "title": "Source-verified activity name",
  "category": "photography_art",
  "activityKind": "recurring_community",
  "city": "Pune",
  "area": "Verified area",
  "costStatus": "unknown",
  "scheduleKind": "recurring",
  "sourceName": "Organizer website",
  "sourceUrl": "https://example.org/real-source",
  "verifiedAt": "2026-10-21T00:00:00+05:30",
  "verificationStatus": "verified",
  "verificationNotes": "The source confirms the group and area; current meeting dates and fees were not listed.",
  "demoOnly": false,
  "tags": ["photography", "beginner_friendly_if_source_verified"]
}
```

The example values are a **schema illustration only**, not a real activity. Never include it in the live dataset.

## 2. Qloo normalized data

Keep the normalized form minimal:

- provider request ID / internal correlation ID;
- requested endpoint family, result status and elapsed time;
- query's resolved entity IDs, names, documented type, and tag IDs where needed;
- place/cultural entity IDs and only the metadata used to rank or explain results;
- explainability fields if actually returned;
- retrieval time and whether result came from private server cache.

Do not save the entire response body to the repo, public assets, browser local storage, or Firestore. Private server-side caching is allowed by the hackathon guide.

## 3. User preferences

Store only what is required for generation and a user's explicit saved pathway. Suggested fields:

- `categories[]`
- selected favourite entity IDs and display names only if needed to replay the pathway
- selected Pune areas / distance preference
- budget preference and flexible-budget flag
- available days and time windows
- social comfort level
- consent/source acknowledgement if needed

Do not infer or collect sensitive personal attributes such as religion, ethnicity, political affiliation, health status, sexuality or exact demographic profiles for recommendations. They are not needed for this product.

## 4. Saved pathway

Suggested document fields:

- `id`, `createdAt`, `title`, `city` (Pune)
- `preferencesSnapshot` (minimal necessary fields)
- `steps[]` with `activityId`, ordering, role and generated explanation
- `activitySnapshot[]` for display when an activity record changes, including source URL and verification status at time of save
- `method` (`qloo` or `baseline`), `qlooUsed`, `explainabilityAvailable`
- `sourceStatusSummary`

Do not store raw Qloo request/response data, API credentials, internal error stacks or full server logs in the pathway document.

## 5. Dataset QA and freshness policy

- Re-open every `sourceUrl` before labeling a record verified.
- Check the specific facts displayed: current organization existence, location, schedule/recurrence, price, registration link and image provenance.
- A record can be verified for existence while its schedule/price remains unknown; verification notes must specify this.
- Date-specific events are rechecked shortly before demo day; expired events are removed or marked stale.
- When a page moves, source disappears or facts conflict, mark stale/unverified until rechecked.
- Seed the largest reliable categories first but aim for at least two verified records per category where feasible. Never fake coverage.
