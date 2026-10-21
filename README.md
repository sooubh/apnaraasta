# ApnaRaasta — Agent Handoff Documentation

**Tagline:** From Your Interests to Your People.  
**Document status:** Product decisions locked; implementation may begin only by following these documents.  
**Current target:** Mobile-first responsive web app for the Qloo Agentic Hackathon. Native mobile app is post-hackathon scope.

## Start here — required reading order

1. [`AGENTS.md`](AGENTS.md) — master instructions for Antigravity/coding agents.
2. [`RULES.md`](RULES.md) — non-negotiable scope, UI, data, security, and completion rules.
3. [`PRD.md`](PRD.md) — product requirements and explicit non-goals.
4. [`UI_REFERENCE_SPEC.md`](UI_REFERENCE_SPEC.md) — analysis of the screenshots supplied by the product owner. The included images are the visual source of truth.
5. [`TRD.md`](TRD.md) — technical implementation direction.
6. [`QLOO_INTEGRATION.md`](QLOO_INTEGRATION.md) — verified Qloo API usage and guardrails.
7. [`ARCHITECTURE.md`](ARCHITECTURE.md), [`API_CONTRACTS.md`](API_CONTRACTS.md), [`DATA_MODEL.md`](DATA_MODEL.md), [`SECURITY_AND_PRIVACY.md`](SECURITY_AND_PRIVACY.md).
8. [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md), [`TEST_PLAN.md`](TEST_PLAN.md), [`ACCEPTANCE_CRITERIA.md`](ACCEPTANCE_CRITERIA.md), and [`DEMO_GUIDE.md`](DEMO_GUIDE.md).

Do not begin by generating UI or creating files before reading the source of truth. If any implementation choice conflicts with a locked decision below, stop and report the conflict instead of improvising.

## Locked product decisions

- Product: ApnaRaasta, a Qloo-powered AI agent helping anyone seeking cultural communities discover local activities and recurring communities.
- Launch city: Pune, Maharashtra, India.
- Platform now: mobile-first responsive web app; Next.js + TypeScript + Tailwind CSS; deployment on Vercel.
- Native app: explicitly post-hackathon.
- LLM: Gemini, using controlled server-side tool/function calling.
- Cultural intelligence: Qloo API using the hackathon environment and documented endpoints.
- Activity data: hybrid — manually curated Pune records with source links and verification dates; live data only where the source is accessible and its returned facts are reliably verifiable.
- Main experience: guided onboarding → taste signal resolution → Qloo-powered agent → one coherent 3-step pathway → alternatives/regenerate.
- Core activity categories: music and films; photography and art; books and board games; food experiences; outdoor activities; volunteering.
- Filters: budget, area/distance, available days/times, social comfort level.
- Community means activities and recurring communities. It does **not** mean matching individual people.
- Guests may generate a pathway. Google sign-in is required to save pathways and view history.
- Judges/users can open a separate Qloo-vs-generic-AI comparison screen.
- Activities link out to source/registration pages. No in-app booking, payments, or messaging.
- Saved pathway/history support is in scope for signed-in users.
- User-provided UI reference screenshots are mandatory visual direction. Do not invent a new design system or copy unrelated features from the references.
- Fresh repository. Do not modify unrelated repositories or add unrelated infrastructure.

## Repository organization expected after implementation

The agent may adapt paths to sensible Next.js conventions but should retain clear feature boundaries. Recommended:

```text
src/
  app/                     # routes and route handlers
  components/              # reusable UI components
  features/onboarding/     # onboarding state and components
  features/pathway/        # pathway generation/results
  features/benchmark/      # Qloo vs baseline comparison
  features/history/        # signed-in saved pathways
  lib/qloo/                # server-only Qloo adapter
  lib/gemini/              # server-only Gemini adapter/tool schemas
  lib/activities/          # verified activity data and filtering
  lib/firebase/            # Firebase client config and auth
  lib/validation/          # input/output schemas
  types/                   # shared types
 data/activities/           # curated records + source/verification metadata
 docs/                      # keep this handoff pack or a current copy
 tests/                     # unit/integration/e2e tests
```

## Qloo technical facts checked against the official guide

- Hackathon API base URL: `https://hackathon.api.qloo.com`.
- Use `X-Api-Key` header; never put the key in a URL, browser bundle, committed file, or client-side request.
- The Insights API is `GET /v2/insights`; `/search` is a separate entity lookup endpoint.
- Use `/v2/tags` (per current guide) when resolving valid tag IDs.
- Do **not** use legacy `/recs` or `/recommendations` endpoints.
- Only documented parameters supported by a selected `filter.type` should be used; unsupported parameters can be silently ignored.
- Private server-side caching is permitted by the hackathon guide, but Qloo response data must not be placed in the public repository.

See [`QLOO_INTEGRATION.md`](QLOO_INTEGRATION.md) and [`SOURCE_REGISTER.md`](SOURCE_REGISTER.md).

## Before marking this pack complete

The coding agent must replace no locked requirement. It must establish a working build, demonstrate real Qloo calls, record the dataset's evidence, test Firestore rules, and deploy a working HTTPS demo. It must not claim a test passed unless it was executed and its result observed.
