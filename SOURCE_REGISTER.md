# Source Register

This register records the official documentation used to ground Qloo integration. URLs were opened during documentation preparation on 2026-10-21; the implementing agent must re-check them before coding because API contracts can change.

1. **Qloo Agentic Hackathon Developer Guide**  
   https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide  
   Used for hackathon base URL, authentication header, supported endpoint guidance, supported Insights entity types, legacy endpoint warning, correct HTTP method, parameter validation, empty results, quotas/key period and private-cache/public-repo policy.

2. **Insights API Deep Dive**  
   https://docs.qloo.com/reference/insights-api-deep-dive  
   Used for `/v2/insights`, required `filter.type`, location/query semantics, supported signals, `feature.explainability`, and `take` limit guidance.

3. **Entity Type Parameter Guide**  
   https://docs.qloo.com/reference/available-parameters-by-entity-type  
   Used to verify that parameter support depends on the chosen entity type and to inspect the place/artist/book parameter lists.

4. **Search Entities**  
   https://docs.qloo.com/reference/get-search  
   Used for the distinct `/search` endpoint, entity lookup role, query/types/nearby filters and its separate type contract.

5. **API Overview**  
   https://docs.qloo.com/reference/api-overview  
   Used to distinguish Insights, lookup APIs and analysis/trend APIs and to choose only product-relevant services.

6. **Parameter Reference**  
   https://docs.qloo.com/reference/parameters  
   Used for documented parameter names/types and compatibility notes.

## Implementation-time verification required

- Exact current response schema for `/search`, `/v2/tags` and `/v2/insights`.
- Exact accepted `/search` types for all desired favourite entity kinds.
- Exact `filter.location.query` or locality parameter behavior for the selected Insights result type.
- Every signal/filter supported by `filter.type=urn:entity:place` in the current guide.
- Exact current Gemini SDK and function-calling syntax from the official Google Gen AI docs.
- Current hackathon submission/license requirements and the current key's working environment.

Do not interpret this source register as evidence that every parameter combination was live-tested. It is documentation research, not an API-call test report.
