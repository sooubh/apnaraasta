# AGENTS.md — ApnaRaasta Master Agent Instructions

## Mission

Build only the approved ApnaRaasta hackathon prototype documented in this repository. Make the real Qloo integration essential and observable, use Gemini as the controlled agent/orchestrator, use verifiable Pune activity data, and follow the supplied visual references. Do not expand the product into a general events/social network.

## Mandatory read order

Read `RULES.md`, `PRD.md`, `UI_REFERENCE_SPEC.md`, `TRD.md`, `QLOO_INTEGRATION.md`, `ARCHITECTURE.md`, `API_CONTRACTS.md`, `DATA_MODEL.md`, `SECURITY_AND_PRIVACY.md`, `IMPLEMENTATION_PLAN.md`, `TEST_PLAN.md`, and `ACCEPTANCE_CRITERIA.md` before implementation. Treat `DECISION_LOG.md` as the lock record.

## Phase gates

### Phase 0 — preflight audit (no feature coding)

1. Inspect the fresh repository and existing project configuration; don't assume it contains an app.
2. Confirm runtime/package manager, versions and available environment variables without printing secret values.
3. Read both files in `assets/ui-references/` and `UI_REFERENCE_SPEC.md`.
4. Verify current Qloo endpoint/parameter docs and Gemini tool-calling docs using official sources before implementing provider code. Do not rely on memory for changing SDK APIs.
5. Create a concise implementation plan mapped to the phases and acceptance IDs in the docs. Do not introduce extra product features.

### Phase 1 — foundation

Set up Next.js App Router, TypeScript, Tailwind CSS, lint/typecheck/test commands, server-only provider adapters, Firebase client/auth setup, validation, and safe environment configuration. Use stable compatible dependency versions. Don't add a design framework or animation dependency without a concrete need.

### Phase 2 — verified activity data and Qloo

Create a source-backed activity model and curate real Pune records. For each record, record source URL, source label, verification timestamp, and the exact fields the source supports. Integrate documented Qloo entity lookup and Insights API calls. Prove the API integration with a real request before building a fake-looking UI demo. Never place real keys or raw Qloo responses in source control.

### Phase 3 — agent and pathway

Implement a bounded Gemini tool-calling workflow. Use tools only for Qloo lookup/insights, filtering the approved activity set, building/ranking candidates, and generating pathway explanations. Validate every tool input/output. Enforce a finite step limit and return a safe typed failure if Qloo or Gemini fails. No autonomous web browsing, arbitrary URL fetch, shell execution, or side-effecting tools.

### Phase 4 — UI using references

Implement only the approved routes/states listed in `UI_REFERENCE_SPEC.md` and `PRD.md`. Reuse shared components and design tokens extracted from the supplied images. The references govern styling and visual quality; PRD governs product behavior. Do not clone features shown in references that ApnaRaasta does not need. Do not make up a new palette/layout because it seems trendy. If a major visual decision cannot be inferred, make the smallest conservative extension of the reference and record it; do not create unrelated screens.

### Phase 5 — persistence, benchmark, hardening

Implement Google sign-in, owner-scoped Firestore persistence/history, comparison mode using the same candidate pool, validation, abuse/cost controls, and error states. Do not store full/raw Qloo payloads in Firestore.

### Phase 6 — verification and deployment

Run all commands in `TEST_PLAN.md`; inspect responsive layouts; test Qloo failure/empty-result scenarios; verify Firestore rules; build a production build; deploy to Vercel only with configured secrets; verify the live demo. Update docs with actual deployment facts and any known limitations. Do not silently omit tests.

## Agent coordination

- Prefer one implementation owner with bounded specialist tasks for Qloo, Firebase/security, UI QA, and tests if multi-agent execution is used.
- Each sub-agent must return: files changed, decisions made, commands run, test outputs, risks, and unresolved blockers.
- Sub-agents may not independently alter PRD scope, UI direction, categories, navigation, brand, or architecture.
- Merge work only after reviewing diffs for scope creep, secrets, duplicate components, and contradictory contracts.
- Avoid parallel changes to the same files.

## Decision authority

Locked decisions are in `DECISION_LOG.md`. The agent may choose internal implementation details only when they don't affect the product experience, user privacy, API contract, visual reference compliance, cost model, or deployability. Ask the product owner before changing any of those dimensions.

## Required reporting format at every phase boundary

Report: completed acceptance IDs, changed files, commands actually run and pass/fail, screenshots/checks done, provider integration proof, known limitations, and next phase. No unsupported "done" claims.
