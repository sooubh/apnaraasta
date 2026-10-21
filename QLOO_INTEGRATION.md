# Qloo Integration Specification

## 1. Purpose

Qloo is the cultural-intelligence layer of ApnaRaasta. It must materially influence the discovery and ranking process by translating selected cultural preferences into related entities/place affinities and explainable input signals. A call made only to satisfy a checklist, while the same recommendation is produced independently of the response, does not count as integration.

The primary official reference provided by the owner is the [Qloo Agentic Hackathon Developer Guide](https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide). Read it and follow its linked endpoint/parameter documentation during implementation.

## 2. Verified hackathon-specific facts

- **Base URL for hackathon key:** `https://hackathon.api.qloo.com`.
- Hackathon keys do **not** work against `https://api.qloo.com` or `https://staging.api.qloo.com`.
- Authentication: `X-Api-Key: <server-side secret>` header.
- Insights endpoint: `GET /v2/insights`.
- Search endpoint: `GET /search`.
- Tags lookup: use the documented `/v2/tags` endpoint as referenced by the current guide and verify its current parameter contract before coding.
- Do **not** call legacy `/recs` or `/recommendations` endpoints.
- `/v2/insights` is a GET request with parameters in its query string (per hackathon guide); do not send a POST body to that endpoint.
- `filter.type` is required for Insights and must be compatible with every parameter included.
- Official supported Insight entity types listed in the guide include `urn:entity:artist`, `urn:entity:book`, `urn:entity:brand`, `urn:entity:destination`, `urn:entity:movie`, `urn:entity:person`, `urn:entity:place`, `urn:entity:podcast`, `urn:entity:tv_show`, and `urn:entity:video_game`.
- For music entities use the artist type, not `urn:entity:music`. For food/beverage places, use documented place/brand types, not `urn:entity:food_and_drink`.
- Search types are not identical to Insights `filter.type`; consult the Search endpoint's current contract.
- Freeform tag names are not valid tag IDs. Resolve tags through Qloo's tag lookup first.
- Unsupported parameters may be silently ignored, causing empty/unexpected results; confirm each parameter in the Entity Type Parameter Guide.
- The hackathon guide permits private server-side caching but says Qloo response data must not be stored in a public repository.

## 3. Approved integration flow

### Step A — collect taste inputs

The user can select one or more approved categories and optionally type favourite cultural entities such as musicians, films, books or other supported entities. Do not require users to know specific entity names.

### Step B — resolve IDs

Use `/search` to resolve names to Qloo entity IDs and `/v2/tags` to resolve supported tag IDs. Save normalized fields required for the current request only. A misspelled/ambiguous entity must be handled as unresolved, not passed as a guaranteed ID. Where multiple search candidates are returned, apply documented response fields and disambiguation rules; if ambiguity remains, either ask the user to choose or omit that signal.

### Step C — request relevant insights

Use `GET /v2/insights` with:

- a documented `filter.type` (likely `urn:entity:place` for place/venue candidates, if this is the intended output type);
- resolved input entities via `signal.interests.entities` and/or valid `signal.interests.tags` where supported;
- the documented locality/location parameter for Pune (`filter.location.query`, `signal.location.query`, or a resolved locality ID, only after checking the exact intended semantics in current parameter docs);
- bounded `take` value;
- `feature.explainability=true` where supported, so the app can inspect whether input signals contributed.

Parameter combinations are entity-type dependent. The above is a design pattern, not a guarantee that every parameter is valid together. Test each request against current docs and log parameter names/status—not the secret.

### Step D — normalize and join

Normalize the response to the smallest internal structure needed: entity ID, entity name, supported entity type, source/provenance, relevant category/tags, available location fields, affinity fields if provided and legal to use, and explainability contributions if returned. Do not forward the entire raw Qloo JSON response to the browser.

Join Qloo output to verified local activities where there is a defensible relationship. A cultural entity is not proof of a physical group/event. If the join is category-based rather than exact entity-to-activity, record that distinction and explain it honestly.

### Step E — use Qloo in ranking

Use the Qloo signal to influence candidate selection or ordering in the Qloo arm. Add deterministic rules to respect hard preferences such as budget, user-selected area and verified schedule. The agent must not override hard constraints simply because Qloo returns a high-affinity entity.

### Step F — show evidence

When real Qloo explainability is returned, use it to ground a concise “why this fits” explanation. If not available, do not simulate it; explain the recommendation using the actual user preferences and activity metadata and label it as agent-generated rationale.

## 4. Example requests — shape only

### Entity search

```bash
curl --get \
  --header "X-Api-Key: ${QLOO_API_KEY}" \
  --data-urlencode "query=Radiohead" \
  --data-urlencode "types=urn:entity:artist" \
  "${QLOO_BASE_URL}/search"
```

Treat `types` and the response schema according to the current Search Entities documentation. This example is illustrative; verify accepted search types before use.

### Insights

```bash
curl --get \
  --header "X-Api-Key: ${QLOO_API_KEY}" \
  --data-urlencode "filter.type=urn:entity:place" \
  --data-urlencode "filter.location.query=Pune" \
  --data-urlencode "signal.interests.entities=${QLOO_ENTITY_ID}" \
  --data-urlencode "feature.explainability=true" \
  --data-urlencode "take=20" \
  "${QLOO_BASE_URL}/v2/insights"
```

This is a request-shape illustration, not a promise that the exact combination returns useful Pune data for every entity. Before implementation, validate the location/query parameter and `signal.interests.entities` support for `urn:entity:place` in current docs; url-encode all values and handle an empty result. Do not put a real API key in examples or screenshots.

## 5. API adapter contract

The `qloo` module should export typed operations such as:

- `searchEntities(input) -> ResolvedEntity[]`
- `searchTags(input) -> ResolvedTag[]`
- `getCulturalInsights(input) -> NormalizedInsightResult`

The adapter must:

- use a fixed configured base URL and server-only key;
- impose timeouts and return typed errors;
- validate response shape before use;
- distinguish 401, 403, 400/invalid parameter, 404/no result, 429, provider 5xx, timeout and empty success;
- never silently invent results on errors;
- log request ID, endpoint family, response status, elapsed time and safe error code only;
- never log key, raw request headers or full raw response;
- return normalized/minimal data to the rest of the app;
- use private server-side cache only and never commit raw response payloads.

## 6. Empty/failed Qloo behavior

- Empty search: let the user skip that specific favorite or choose a disambiguated result; category selection can remain useful.
- Empty insights for Pune: try only documented broadening of the query/parameters or another relevant supported category; don't brute-force undocumented params.
- 401: verify hackathon base URL and `X-Api-Key` configuration; do not print key.
- 403: verify supported entity type.
- Empty `entities` with 200: inspect supported parameters and region/entity coverage.
- 429: show a retry-later state and prevent rapid retries.
- Qloo unavailable: benchmark arm marked unavailable/partial; never substitute a baseline while calling it Qloo.

## 7. How Qloo and local activity data fit together

Qloo provides taste/cultural relationships and some place/entity insights. ApnaRaasta needs verified proof of a local activity's existence, location, schedule, price and registration details. Use a separate `Activity` data model with `sourceUrl`, `sourceName`, `verifiedAt` and status. A Qloo result may inform affinity but it is not a source verification record for a meetup or workshop.

For the fair comparison, the activity candidate pool must be assembled and verified first, then passed identically to both arms. Qloo can influence ranking in its arm; it cannot receive extra unverified candidates.

## 8. Privacy, caching and repo hygiene

- Qloo keys stay in Vercel server environment and local ignored environment files.
- Never expose keys via `NEXT_PUBLIC_` variables or client fetches.
- Do not add raw Qloo responses to `data/`, screenshots, fixtures, GitHub issues, or public docs.
- Private runtime cache is allowed by the current hackathon guide. Keep cache server-only and separate from public fixtures.
- Persist only minimal user-generated pathway data. Do not persist the full Qloo response in Firestore.

## 9. Current official references

- [Hackathon Developer Guide](https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide)
- [Insights API Deep Dive](https://docs.qloo.com/reference/insights-api-deep-dive)
- [Entity Type Parameter Guide](https://docs.qloo.com/reference/available-parameters-by-entity-type)
- [Search Entities](https://docs.qloo.com/reference/get-search)
- [API Overview](https://docs.qloo.com/reference/api-overview)
- [Parameter Reference](https://docs.qloo.com/reference/parameters)

Recheck these docs before coding because supported parameters and SDK/API details may evolve.
