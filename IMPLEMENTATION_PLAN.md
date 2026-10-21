# Phased Implementation Plan

This plan protects the deadline by completing one vertical slice at a time. Do not add features outside PRD scope to fill time.

## Phase 0 — Preflight and requirements lock

**Tasks**
- Read all docs and visual references.
- Confirm current supported Qloo endpoint/parameter combinations and Gemini function-calling SDK method names from official docs.
- Create plan and list blockers; make no unapproved UI choices.

**Exit gate**
- Every work item maps to PRD requirement and acceptance ID.
- No unresolved ambiguity about feature scope, data truthfulness, keys or visual authority.

## Phase 1 — Clean project foundation

**Tasks**
- Initialise Next.js App Router, TypeScript, Tailwind and formatting/lint/typecheck/test scripts.
- Add `.env.example`, secret-safe `.gitignore`, typed error shape and schema validation.
- Add Firebase client setup and optional Google provider without opening Firestore access.
- Establish server-only modules for providers.

**Exit gate**
- Fresh install, lint, typecheck and production build run.
- Qloo/Gemini secrets are not imported into client components.

## Phase 2 — Source-backed activity catalogue

**Tasks**
- Define activity data schema.
- Research real Pune activities/recurring groups using reliable source pages.
- Aim for ≥2 verified records per approved category where feasible; do not fake coverage.
- Add source/verification metadata and a coverage report.
- Add deterministic filtering by category, budget, area and known schedules.

**Exit gate**
- All records in production candidate pool have their required source evidence.
- Unknown fields remain unknown, and test/demo fixtures are separated.

## Phase 3 — Actual Qloo integration

**Tasks**
- Implement `/search` entity resolution and `/v2/tags` lookup where needed.
- Implement `/v2/insights` using supported entity types/parameters for the current use case.
- Include explainability option when supported.
- Normalise results, handle error cases, apply safe private caching and return minimal data.

**Exit gate**
- Real smoke tests pass with the hackathon base URL and `X-Api-Key`.
- One test proves Qloo results are used in candidate ranking.
- No raw payload/secret in repo, client response or public dataset.

## Phase 4 — Gemini agent and one end-to-end pathway

**Tasks**
- Add bounded tool calling with the fixed tool allow-list.
- Filter candidates deterministically before LLM ranking.
- Generate exactly three ordered steps with alternatives and evidence-grounded explanations.
- Validate candidate IDs, hard constraints and response schema.
- Implement honest loading/empty/error/partial states.

**Exit gate**
- One guest can generate a real Qloo-informed pathway from the real verified activity catalogue.
- Agent cannot invent candidate IDs; no hard-coded successful pathway.

## Phase 5 — UI implementation to reference

**Tasks**
- Implement entry/onboarding, pathway result, alternatives/regenerate, comparison, sign-in and history states in the style reference.
- Add consistent tokens/components based on images.
- Add factual images only where properly sourced; otherwise use category placeholders.
- Implement responsive and accessibility behavior.

**Exit gate**
- Actual screen captures reviewed against references at mobile and desktop sizes.
- No forbidden feature imported from the reference apps.

## Phase 6 — Benchmark, Auth and history

**Tasks**
- Add generic baseline arm with Qloo data removed.
- Ensure both arms use identical candidate pool and constraints.
- Compute documented factual metrics.
- Add Google sign-in, save pathway and history view.
- Lock Firestore rules and test ownership.

**Exit gate**
- Benchmark is auditable and honest.
- Google-authenticated owner can save/read own data; other users cannot access it.

## Phase 7 — Hardening and release

**Tasks**
- Test provider failure, empty results, 429, timeouts, invalid outputs, source staleness and auth cancellation.
- Run lint, typecheck, unit/integration/E2E where included, and production build.
- Review bundle and git history for secrets/raw Qloo payloads.
- Deploy to Vercel, run live smoke tests and prepare a clear demo script.
- Update README, source coverage notes and known limitations.

**Exit gate**
- Every release acceptance criterion is PASS or explicitly recorded as a blocker.
- Live demo is reachable over HTTPS and doesn't depend on local development state.

## Priority rule if time is short

Preserve in this order: real Qloo integration; verified candidate data; one working end-to-end pathway; fair comparison; core visual quality and accessibility; Google save/history; extra polish. Do not add new features. If history is the only incomplete stretch feature, disclose it; do not fake a backend.
