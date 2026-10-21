# Acceptance Criteria and Release Gate

Use IDs in the final agent report. `PASS` means evidenced by a run/check; otherwise mark `FAIL`, `PARTIAL`, or `NOT VERIFIED`.

## Product

- **AC-01:** App presents ApnaRaasta as a cultural community pathway tool, not a generic events/social app.
- **AC-02:** Scope is limited to Pune and the six approved interest categories.
- **AC-03:** User can generate as a guest.
- **AC-04:** Guided onboarding collects interests, budget, area/distance, available days/times and social comfort.
- **AC-05:** Primary output contains exactly three ordered steps; alternatives are limited and data-backed.
- **AC-06:** Regenerate recomputes from current inputs and does not simply replay a static example.
- **AC-07:** No booking, payment, messaging, social graph, event creation, RSVP, premium or map-routing functionality exists.

## Qloo/Gemini

- **AC-08:** Qloo requests use `https://hackathon.api.qloo.com` and `X-Api-Key` from server env.
- **AC-09:** API calls use documented `/search`, `/v2/tags`, `/v2/insights` as needed, not legacy `/recs`/`/recommendations`.
- **AC-10:** Actual Qloo response data materially influences Qloo-arm candidate ordering/reasons.
- **AC-11:** Current `filter.type` and parameters are validated against official documentation.
- **AC-12:** A real Qloo smoke test is evidenced by status, response count and elapsed time, without key/raw payload in public logs.
- **AC-13:** Gemini agent is bounded and uses a fixed tool allow-list.
- **AC-14:** Output is schema-validated and can reference only candidate IDs in the current pool.
- **AC-15:** Qloo/Gemini failure states are honest; no fabricated provider success.

## Activity truthfulness

- **AC-16:** Each real record has source name, URL, verification timestamp and provenance status.
- **AC-17:** Specific event dates, prices, hours and registration links appear only where source-verified.
- **AC-18:** Demo-only and unverified records are never silently treated as real.
- **AC-19:** There is a source coverage summary; gaps are disclosed, not hidden with fake records.
- **AC-20:** Every external action points to a verified official/credible source.

## Fair comparison

- **AC-21:** Baseline and Qloo arm use the exact same user preferences, activity candidate IDs and hard constraints.
- **AC-22:** Baseline receives no Qloo entity IDs, affinity data or explainability data.
- **AC-23:** Qloo arm is only labelled successful when a real Qloo result was used.
- **AC-24:** Displayed metrics are programmatically computed and documented.
- **AC-25:** Comparison text avoids unsubstantiated population-wide accuracy or superiority claims.

## Auth/security

- **AC-26:** Google sign-in is optional for generation but required for save/history.
- **AC-27:** Signed-in user can save and view own pathways.
- **AC-28:** Firestore rules block anonymous and cross-user reads/writes.
- **AC-29:** No provider secret in client bundle, git repo or public assets.
- **AC-30:** No raw Qloo payload in public repo/fixtures/Firestore.
- **AC-31:** Rate/time/step limits and safe errors exist.

## UI and quality

- **AC-32:** UI follows `UI_REFERENCE_SPEC.md`; both supplied images are reviewed during QA.
- **AC-33:** App is usable at small mobile, normal mobile, and desktop sizes.
- **AC-34:** Loading, empty, stale/partial, failure and sign-in cancellation states are designed.
- **AC-35:** Basic keyboard navigation, semantic labels, visible focus and reduced-motion support exist.
- **AC-36:** No feature copied from reference images violates scope.

## Delivery

- **AC-37:** Public repo contains open-source license and accurate README.
- **AC-38:** `.env.example` lists required variable names with placeholders only.
- **AC-39:** Lint, typecheck, tests and production build were executed; the report includes actual results.
- **AC-40:** A live HTTPS Vercel demo is smoke-tested with real integrations.
- **AC-41:** Known limits and partially completed items are reported truthfully.
