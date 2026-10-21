# Decision Log — Locked Requirements

| ID | Decision | Status | Notes |
|---|---|---|---|
| D-01 | Product name is ApnaRaasta; tagline “From Your Interests to Your People.” | Locked | Do not rename. |
| D-02 | Current deliverable is a responsive web app; native app is post-hackathon. | Locked | Do not build Flutter/React Native now. |
| D-03 | Next.js + TypeScript + Tailwind CSS, Vercel deployment. | Locked direction | Use stable compatible versions. |
| D-04 | Launch geography is Pune. | Locked | No other cities in MVP. |
| D-05 | Audience is anyone seeking cultural communities, not only college students. | Locked | Keep the language inclusive. |
| D-06 | Community means activities and recurring communities, not individual people matching. | Locked | No social graph or messaging. |
| D-07 | Categories: music/films; photography/art; books/board games; food; outdoor; volunteering. | Locked | Map to Qloo-supported types/tags where valid. |
| D-08 | Main flow is guided onboarding then one 3-step pathway with alternatives/regenerate. | Locked | No open-ended general chatbot as the main product. |
| D-09 | Filters: budget, area/distance, days/times, social comfort. | Locked | Device location optional; manual area works. |
| D-10 | Activity data is hybrid: curated source-backed baseline + verified live data only if feasible. | Locked | No fictional real-world listings. |
| D-11 | Recurring/evergreen first; dated events only if verified. | Locked | Unknown schedule fields remain unknown. |
| D-12 | Gemini is the LLM provider. | Locked | Use bounded tool calling. |
| D-13 | Qloo is essential to core ranking and comparison. | Locked | Real API key available; verify current endpoint/parameter docs. |
| D-14 | Benchmark is a separate comparison experience. | Locked | Same candidate pool and constraints for both arms. |
| D-15 | Guest can generate; Google sign-in required to save/history. | Locked | Firebase Auth + Firestore. |
| D-16 | No in-app booking, payments, messaging. | Locked | Only verified external links. |
| D-17 | UI follows the two supplied visual references. | Locked | Images stored under `assets/ui-references/`. |
| D-18 | Reference-only features (map, chat, RSVP, premium, create-event, courses) must not be copied into MVP. | Locked scope guard | Map specifically not required. |
| D-19 | Fresh dedicated repository. | Locked | Repository URL not yet specified; don't invent. |
| D-20 | UI must not be invented without owner-provided references; references have now been provided. | Locked | Use conservative reference-aligned interpretation. |
| D-21 | Public repo and Vercel-hosted live demo are delivery expectations. | Locked direction | Confirm repo license before public launch. |

## Scope-change procedure

Any proposed change affecting user-visible features, navigation, visual language, provider/data source, auth/privacy, deployment or timeline must be written as a proposal with benefit, cost/risk and affected requirements, then receive product-owner approval before implementation. A coding agent cannot self-approve its proposal.
