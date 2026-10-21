# Product Requirements Document (PRD)

## 1. Product summary

**Name:** ApnaRaasta  
**Tagline:** From Your Interests to Your People.  
**Product type:** Qloo-powered, Gemini-agentic, mobile-first responsive web application.  
**Launch geography:** Pune, Maharashtra, India.  
**Stage:** Hackathon prototype; native mobile app is a later phase.

ApnaRaasta helps people discover culturally relevant local activities and recurring communities, then turns those interests into a practical three-step pathway toward participation. Instead of returning a generic list of events, it uses Qloo cultural signals, a verified local activity dataset and a bounded Gemini agent to construct an evidence-aware pathway that respects budget, area/distance, time availability and social comfort.

## 2. Problem and product hypothesis

### Problem
Someone new to a city—or simply trying to find a community—may know what they enjoy but not which local activities are relevant, approachable or recurring. A search result list requires the user to do the matching and decide how to move from first visit to sustained participation.

### Hypothesis
If ApnaRaasta converts a user's cultural preferences into Qloo-informed candidate signals and connects them to a small, reliable catalogue of local activities, it can offer a more personally relevant and actionable pathway than a generic LLM using only the user's text description.

This is a product hypothesis to demonstrate, not a result to claim in advance. The comparison feature must make differences inspectable and avoid fabricated accuracy claims.

## 3. Audience

**Primary audience:** Anyone seeking cultural communities and activities in Pune. This includes people new to Pune, students, young adults and residents exploring new interests. Do not narrow the product to college students only; that narrower target was considered but the product owner selected the broader audience.

### User needs

- Express interests through familiar cultural entities or categories.
- Find suitable local activities without searching many disconnected platforms.
- Stay inside budget, preferred area/distance and available time.
- Choose a pathway that matches their preferred level of social intensity.
- Understand why an activity was recommended and verify the source.
- Save useful pathways after signing in.

## 4. Product goals

1. Demonstrate meaningful use of the Qloo API in the core ranking/selection process.
2. Produce one coherent, useful three-step community pathway with alternatives.
3. Use real, sourced Pune activity records rather than fabricated listings.
4. Make the experience polished on mobile and usable on desktop via a live HTTPS demo.
5. Demonstrate an honest Qloo-vs-generic-AI comparison using the same inputs and candidate pool.
6. Keep implementation achievable before the hackathon deadline and easy to explain to judges.

## 5. Non-goals

Do not build social networking or individual people matching; messaging/chat; user posts; likes/following; event creation; RSVP/check-in; ticketing/bookings/payments; subscriptions/coins/ads; an organizer dashboard; a complete event marketplace; an interactive map/navigation; multi-city support; native Android/iOS clients; or unrequested profile, notifications, blogging, gamification and analytics features.

External source/registration links are allowed. ApnaRaasta does not promise that a venue has open slots, a group will accept new members, or a listing is available today unless the source explicitly verifies it.

## 6. Locked technology and delivery assumptions

- Frontend and server routes: Next.js App Router + TypeScript + Tailwind CSS.
- AI provider: Gemini with bounded tool/function calling.
- Cultural intelligence: Qloo API, hackathon base URL.
- Auth and history: Firebase Authentication, Google provider; Firestore for signed-in users.
- Activity records: curated dataset with provenance; optional live source adapter only when verifiable and worth the time.
- Hosting: Vercel.
- Repository: new, dedicated, public repository using an OSI-approved open-source license selected by the owner or documented during setup. Don't invent an organization/repository URL.

## 7. Approved activity categories

1. Music and films.
2. Photography and art.
3. Books and board games.
4. Food experiences.
5. Outdoor activities.
6. Volunteering.

Category labels are product taxonomy, not a statement that Qloo has a corresponding event category or complete local inventory. Map each user choice to documented Qloo entity types/tags where supported. Unsupported categories should use explicit activity metadata and must not produce made-up Qloo signals.

## 8. Main user journey

1. **Start:** User sees a concise explanation of how the product works and can begin as a guest.
2. **Onboard:** User selects interests and, where appropriate, known favourite cultural entities (e.g., artists, films, books) that can be resolved through Qloo. User sets budget, Pune area/distance, available days/times and social comfort.
3. **Resolve signals:** Server resolves names to Qloo entity/tag IDs using documented lookup endpoints and validates them.
4. **Retrieve cultural insights:** Server calls `/v2/insights` with a supported result type, resolved taste signals and documented location parameters. Use Qloo explainability when supported to record which inputs contributed.
5. **Build candidates:** Match cultural signals to the verified local activity catalogue; merge any verified live records before benchmarking so both arms receive the same candidate pool.
6. **Generate pathway:** Gemini uses a finite, defined tool workflow to select a coherent three-step path: approachable first step, stronger shared-interest participation, and a possible recurring community/routine.
7. **Review:** User sees each step, match rationale, practical details, provenance/verification status and relevant external source link. Offer a limited number of alternatives and a regenerate action.
8. **Save:** Guests can use the generated result during the current session. To save a pathway or view history, they sign in with Google; signed-in data is owner-scoped in Firestore.
9. **Compare:** A separate comparison experience runs a baseline without Qloo and a Qloo-informed arm using the same profile and candidate pool.

## 9. Functional requirements

### Onboarding and preferences

- **FR-01:** The user can begin without creating an account.
- **FR-02:** The user can select one or more of the six approved categories.
- **FR-03:** The UI can collect favourite names/entities when the user has them; unknown inputs must not crash the flow.
- **FR-04:** The user can set a budget preference in INR or choose a flexible/no-budget preference.
- **FR-05:** The user can select a Pune area manually. Device location is optional and must never be required.
- **FR-06:** The user can select days/time windows and social comfort level (e.g., quieter/low-pressure through more social), expressed without stigma.
- **FR-07:** Preferences can be reviewed/edited before generating or regenerating.

### Qloo and agent

- **FR-08:** Qloo calls occur only from the server.
- **FR-09:** The system resolves valid entity IDs and tag IDs; freeform names must not be passed as if they were guaranteed valid IDs.
- **FR-10:** The system uses documented `/v2/insights` parameters compatible with the selected `filter.type`.
- **FR-11:** The agent consumes actual Qloo results and verified activity records to affect candidate ranking/sequencing. Qloo must not be a decorative API call.
- **FR-12:** Where Qloo returns explainability metadata, preserve the small amount needed to show evidence; otherwise state that the rationale is AI-generated and do not pretend it is API explainability.
- **FR-13:** The agent must return one primary 3-step pathway, not an unlimited chat transcript or dozens of results.
- **FR-14:** The agent must stop after a configured maximum number of tool/model steps and return structured errors for failures.
- **FR-15:** If Qloo is unavailable or returns no usable data, label the failure/partial state honestly. Never silently label a generic result as Qloo-powered.

### Activity catalogue

- **FR-16:** Every real activity record must have a source URL, source name, verification timestamp and provenance status.
- **FR-17:** The UI distinguishes recurring/evergreen activities from date-specific events and only displays specific dates when verified.
- **FR-18:** Budget and area/distance filters must be applied deterministically where the underlying fields are known.
- **FR-19:** Unknown cost, schedule, location or registration fields are presented as unknown/not listed—not invented.
- **FR-20:** A Qloo place or cultural entity is not by itself evidence of a workshop, meetup or recurring group. The activity source must independently confirm the listing.

### Pathway and discovery result

- **FR-21:** Display one coherent pathway consisting of three ordered steps.
- **FR-22:** Each step contains title, category, why-it-fits explanation, locality/address when verified, cost/schedule fields when verified, a verification/provenance indicator and external source link when available.
- **FR-23:** The pathway includes a small set of alternatives where the candidate dataset supports them.
- **FR-24:** Regenerate changes the ranking/pathway based on the current preferences or user request; it must not be a button that returns identical hard-coded content.
- **FR-25:** The user can return to adjust preferences and regenerate.
- **FR-26:** The experience includes loading, no-results, API-error, stale-data and partial-result states.

### Authentication and history

- **FR-27:** Google sign-in is optional for generation but required for saving and viewing saved pathways.
- **FR-28:** Signed-in users can save a pathway and view their own history.
- **FR-29:** One user must never read or overwrite another user's pathways through the client.
- **FR-30:** Signing in should preserve the currently displayed pathway so that the user can save it without starting over, where practical.

### Benchmark

- **FR-31:** A separate comparison view shows baseline AI and Qloo-informed results for the same user profile and candidate pool.
- **FR-32:** The baseline must not receive Qloo-derived outputs. The Qloo arm must use an actual Qloo call.
- **FR-33:** Both arms use the same verified activity catalogue and hard constraints; keep the Gemini model/configuration and prompt structure as comparable as possible.
- **FR-34:** Comparison explanations identify the approach used and the evidence available. No unsubstantiated score, accuracy, uplift or victory claim.
- **FR-35:** If either arm fails, the UI marks it unavailable/partial instead of simulating a result.

## 10. Verified data requirements

Activity dataset minimum viable expectation: build a small but useful Pune catalogue that covers as many of the six approved categories as reliable sourcing permits. Target at least two source-verified records per category where feasible; never fill a missing category with fictional records merely to meet a count. If coverage is uneven, record it as a known limitation and state which categories are thinly represented.

Required fields are defined in `DATA_MODEL.md`. Sources should be original venue/organization pages or credible current public pages. Re-check date-specific information near demo time. A record with no reliable source must not be shown as a real recommendation.

## 11. UX, visual and accessibility requirements

See `UI_REFERENCE_SPEC.md`. In summary: follow the supplied pale lavender/periwinkle visual language, high-quality rounded cards, clean typography, compact chips, subtle hierarchy and photo-led activity cards where factual imagery is available. Keep the actual app responsive, not a static screenshot mockup. Reference imagery is styling guidance only; do not copy unsupported features from it.

- Accessible labels, clear focus states, keyboard navigation, semantic headings, reduced-motion support.
- Comfortable touch targets and responsive spacing on small phones.
- No design that relies on color alone to indicate verified/unverified status.
- The main path and important actions must be discoverable without a map or social feed.

## 12. Non-functional requirements

- **Reliability:** show understandable errors and allow retry. Don't fail the whole UI because one optional source is unavailable.
- **Security:** keys server-only; validated inputs; strict Firestore owner rules.
- **Performance:** no unbounded agent loops; limit result count; use appropriate private server-side caching and request deduplication.
- **Observability:** request IDs, provider status and sanitized error codes; no secret/payload logging.
- **Maintainability:** provider adapters, validated types, separated data/provenance, tested candidate ranking.
- **Deployability:** reproducible install, lint/typecheck/test/build scripts; HTTPS live demo.

## 13. Success criteria for prototype

1. A judge can open the deployed app and generate a pathway without creating an account.
2. A real Qloo request is made and can be demonstrated through safe diagnostic metadata/logs (not secret or raw full payload disclosure).
3. Qloo output materially changes the candidate ordering/rationale in at least one reproducible test profile compared with baseline, or the measured comparison transparently shows no meaningful difference.
4. Each real activity card has traceable evidence and the interface accurately distinguishes unknown information.
5. Google sign-in enables saving and history with tested access controls.
6. The Qloo-vs-baseline comparison is fair, repeatable and honest about failure.
7. UI matches the supplied references in visual language and functions on mobile and desktop.
8. All release acceptance criteria in `ACCEPTANCE_CRITERIA.md` pass or are explicitly listed as not met.
