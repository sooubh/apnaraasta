# Antigravity Start Prompt — ApnaRaasta

Paste this prompt into Antigravity from the ApnaRaasta repository root after adding the documentation pack and the two reference images.

---

You are the implementation agent for **ApnaRaasta**, a Qloo-powered community-discovery prototype. You are not the product owner and must not redesign the concept or expand its scope.

## Read before editing

Read these files fully before changing code:

1. `AGENTS.md`
2. `RULES.md`
3. `PRD.md`
4. `UI_REFERENCE_SPEC.md`
5. `TRD.md`
6. `QLOO_INTEGRATION.md`
7. `ARCHITECTURE.md`
8. `API_CONTRACTS.md`
9. `DATA_MODEL.md`
10. `SECURITY_AND_PRIVACY.md`
11. `IMPLEMENTATION_PLAN.md`
12. `TEST_PLAN.md`
13. `ACCEPTANCE_CRITERIA.md`
14. `DECISION_LOG.md`

Open and inspect both original visual references under `assets/ui-references/`. They govern visual language; the PRD governs which features exist.

## Mission

Build a mobile-first, responsive **Next.js + TypeScript + Tailwind CSS web app**, deployable to Vercel. Use Gemini with bounded tool/function calling. Integrate the actual Qloo hackathon API server-side. Use real, source-backed Pune activity records. Guests can generate a pathway; Google sign-in is required to save pathways and view history. Include a separate, fair Qloo-vs-generic-AI comparison.

## Start sequence

1. Do the Phase 0 repository/configuration/provider-docs preflight described in `AGENTS.md` and `IMPLEMENTATION_PLAN.md`.
2. Write/update a short implementation checklist with tasks mapped to PRD requirement IDs and acceptance criteria.
3. Verify current Qloo and Gemini request/SDK contracts from the official docs before writing provider code. Do not expose secrets while testing.
4. Proceed through the documented implementation phases in order, keeping each phase buildable and tested.
5. If an essential secret is absent, record the missing environment variable name only; never ask the user to paste a secret into chat or commit it.

## Absolute rules

- Do not create a native app in the hackathon phase.
- Do not invent the UI. Follow `UI_REFERENCE_SPEC.md` and the supplied images. Do not copy the unrelated course screens, message tabs, RSVP controls, premium features, create-event button or map from those references.
- Do not add new cities, chat, friend matching, feeds, event creation, bookings, payments, admin panels or other unapproved features.
- Do not fabricate Pune activities, source URLs, schedules, prices, reviews, attendees, availability, Qloo responses, or benchmark scores.
- Qloo key must stay server-side, use `X-Api-Key`, and use `https://hackathon.api.qloo.com` for the hackathon key. Use documented `/search`, `/v2/tags`, `/v2/insights` as needed. Never use `/recs` or `/recommendations`.
- Confirm each parameter is supported by the chosen `filter.type`; unsupported Qloo parameters may be silently ignored.
- Qloo data must materially affect the Qloo arm. The baseline arm must not receive Qloo data. Both arms must use the same verified activity candidate pool and hard constraints.
- Do not store raw Qloo payloads in the public repository, client storage or Firestore.
- Use a finite tool-calling loop and schema validation. No arbitrary browsing/shell/database tools.
- Test Firestore owner rules. Guest generation must work without sign-in.
- Do not claim a build, test, integration or deployment succeeded unless the command/check actually ran and the output was observed.

## Output at each phase boundary

Report:
- completed PRD/AC IDs;
- files changed;
- commands run and their actual result;
- Qloo integration evidence (status/count/latency, never the key or raw payload);
- data source coverage and freshness gaps;
- visual comparison checks against the supplied references;
- outstanding blockers and risks.

Make minor internal implementation decisions independently when they do not change product behavior or locked scope. Record those decisions. If a major behavior/UI/security/API decision is not covered by the docs, stop and ask the product owner rather than inventing one.

Begin with Phase 0 now.
