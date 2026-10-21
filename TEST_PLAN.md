# Test Plan

## 1. Testing goals

Verify that the app is a real end-to-end Qloo + Gemini product, activity facts are traceable, the comparison is fair, Firebase data is private, and the implementation remains within scope and visual references.

## 2. Unit tests

### Preferences and validation
- Reject invalid category names and unsupported values.
- Normalize empty/optional favourites safely.
- Enforce request length and maximum category/favourite counts.
- Handle budget with flexible/no-budget values and INR correctly.
- Manual area selection works when geolocation is denied or unavailable.

### Activity data
- `verified` records require source URL, source name and verification time.
- Demo/unverified records never enter production results by default.
- Stale or expired date-specific records are excluded or visibly marked according to policy.
- Unknown price/schedule is not converted to free/available.
- Area, budget and supported schedule filters behave deterministically.
- Three pathway steps use distinct valid candidate IDs when viable records exist.

### Qloo adapter
- Uses configured hackathon base URL and `X-Api-Key` header.
- Does not send key in URL/client bundle/logs.
- Search/tag resolver handles no match and ambiguous match.
- Insights adapter validates only documented parameters per entity type.
- Handles 400/401/403/404/429/5xx, timeout and 200 with empty entities.
- Explainability-unavailable output is not fabricated.
- Raw response is normalized and not returned directly to client.

### Gemini agent
- Tool schema/input/output validation.
- Fixed tool allow-list and finite step count.
- Model cannot invent activity IDs that survive validation.
- Invalid JSON receives at most one repair attempt.
- Model reasons do not introduce unverified facts, dates or prices.
- Qloo failure state is retained; no silent fallback mislabel.

### Benchmark
- Both arms receive identical preferences, candidate IDs and hard constraints.
- Baseline payload contains no Qloo outputs.
- Qloo arm fails if no real Qloo result is available; it doesn't use a fake result.
- Any metric is computed from output, not hardcoded.
- Metrics and disclaimer accurately describe the current profile/dataset, not population-wide accuracy.

## 3. Integration tests

- Qloo entity search → tag/entity IDs → Insights request → normalized result.
- Qloo results and verified activity records produce a valid candidate set.
- Gemini creates a three-step result referencing only candidates.
- Full guest generation succeeds without Firebase login.
- Qloo unavailable shows correct state and request ID; baseline-only result is labelled only as baseline if enabled.
- Google sign-in, save pathway and read history work.
- Signing out hides saved history while current guest-visible content remains handled safely.
- Firestore owner can read own docs; another signed-in user and unauthenticated client cannot read/write them.

## 4. End-to-end/browser tests

At minimum:
1. First visit → select categories/favourites → set budget/area/days/social comfort → generate pathway.
2. Result contains exactly three ordered steps and one or more alternatives only when candidates exist.
3. User changes an interest and regenerates; path is recomputed, not hard-coded.
4. Open external activity source link in a safe new tab where appropriate.
5. Run Qloo-vs-baseline comparison with the same profile.
6. Force Qloo failure and confirm the status is honestly shown.
7. Guest clicks save → Google sign-in prompt → successful sign-in saves current pathway.
8. Signed-in user opens history and reopens saved pathway.
9. No candidates → informative empty state, not fake records.
10. Mobile viewport, tablet-ish viewport and desktop viewport visual checks.

## 5. Manual visual QA

- Compare screen captures against `assets/ui-references/` and `UI_REFERENCE_SPEC.md`.
- Check typography, spacing, lavender/periwinkle use, light surfaces, rounded cards, chips, image crop, metadata hierarchy and primary actions.
- Check actual content is ApnaRaasta, not copied Education/Event app labels.
- No message tab, RSVP state, premium badge, create-event plus, or interactive map appears.
- Test keyboard focus, visible labels, reduced motion and accessible text contrast.
- Check no layout overflow at 320px width and that desktop isn't a stretched phone UI.

## 6. Required release commands

Document exact package scripts in README. The final agent report must record which were run and their result. Expected categories:

```bash
# Examples; use exact scripts present in package.json
npm run lint
npm run typecheck
npm test
npm run build
```

Run relevant Firebase rule tests. Run Playwright/E2E suite if implemented. Do not present these commands as passed unless executed successfully.

## 7. Qloo live smoke test

- Run one safe server-side entity lookup using the configured hackathon key.
- Run one documented Insights request for a supported entity type and Pune context.
- Record endpoint family, status code, elapsed time, whether entities were returned and whether explainability was present—never record the API key or raw full payload in docs.
- Confirm the Qloo-powered arm actually consumes the normalized result by running a test profile and inspecting the trace/candidate ranking.
