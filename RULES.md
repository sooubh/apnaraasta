# RULES.md — Non-Negotiable Project Rules

These rules override an agent's default preferences. A violation is a defect, not an improvement.

## 1. Product scope lock

### Allowed

- Guided interest/preference onboarding.
- Six approved interest categories: music and films; photography and art; books and board games; food experiences; outdoor activities; volunteering.
- Preferences: budget, Pune area/distance, days/times, social comfort level.
- Real Qloo entity resolution and taste insights, connected to Gemini tool calling.
- Verified local Pune activity/recurring-community data.
- Exactly one primary 3-step pathway, reasonable alternatives, regenerate.
- Transparent explanations tied to user inputs, Qloo evidence when present, and activity source records.
- Separate Qloo-powered vs generic-AI benchmark experience.
- Guest generation; Google sign-in for saving and pathway history.
- Verified external source/registration links, with no in-app transactions.
- Vercel hosted demo and public open-source repository.

### Forbidden unless the product owner explicitly approves a scope change

- Native Android/iOS application in the hackathon phase.
- Chat/messaging, friend matching, follower lists, social feeds, posting, comments, DMs.
- RSVP/"Going"/"Next time" state, attendee counts, group chat, or event check-in.
- In-app bookings, ticket sales, payments, subscriptions, coins, premium plans, or ads.
- Event creation, organizer/admin dashboard, moderation console.
- Full interactive map, live GPS map pins, route planning, navigation or distance-time estimates. Manual area selection and optional location input are sufficient for MVP; screenshot maps are visual reference only, not a request for mapping functionality.
- Additional cities before Pune is demonstrably working.
- Unrequested profile/settings tabs, notifications, blog, analytics dashboard, gamification, recommendations unrelated to communities, or native-app scaffolding.
- Unsupported claims that ApnaRaasta prevents loneliness, guarantees friendship, or Qloo accurately predicts personal feelings.

## 2. UI reference compliance

- The two supplied screenshots are the only current visual references.
- Use their lavender/periwinkle/pale-violet palette, white/light surfaces, dark high-contrast typography, rounded cards, compact filter chips, image-rich cards where factual images are available, and clear primary actions as the visual language.
- Build for a responsive mobile-first web viewport; don't embed phone mockups in the product itself.
- The UI must look finished, consistent, premium, and reference-aligned. Premium means considered spacing, imagery, typography, card states, loading/error/empty states, and responsive polish—not extra features.
- Never copy unrelated education-course content, premium tags, create buttons, messaging, RSVP behavior, map behavior or navigation from the reference images.
- Do not create a separate navigation destination just because it appears in an image. Routes must map to approved user tasks.
- Do not substitute a different visual trend, default template, dark neon dashboard, generic SaaS layout, or off-the-shelf design system that clashes with the supplied screenshots.
- Don't create placeholder UI with fake event photos/details presented as real. Use verified image sources or honest category placeholders.
- If any visual decision is material and not inferable from the screenshots, stop and ask the owner rather than invent it. For minor implementation gaps, choose the closest conservative pattern and record the choice in `DECISION_LOG.md`.

## 3. Real-data integrity

- Every activity presented as real must have a usable source URL, source name, `verifiedAt`, Pune relevance, and data provenance.
- Do not invent event dates, prices, opening hours, venue addresses, registration links, social groups, availability, or ratings.
- Recurring or evergreen activities can have no specific date; label their schedule as unknown/recurring rather than making up a timetable.
- One-time events may be shown only when date/time is verifiable and still current. Re-check close to demo day.
- Clearly label any test fixture or mock. Never mix it into the “verified” production candidate list.
- Do not silently treat a Qloo cultural entity as proof that a specific meetup/workshop exists. Qloo is cultural intelligence; the local activity record needs its own source evidence.
- Do not claim live API data if the app is showing a cached or curated record. Label provenance honestly.
- Never fabricate Qloo scores, confidence percentages, “compatibility” scores, sources, or benchmark wins.

## 4. Qloo/Gemini rules

- Use the hackathon environment `https://hackathon.api.qloo.com` for the hackathon key.
- Send Qloo API key through the `X-Api-Key` header on server-only calls.
- Use documented endpoints: `/search`, `/v2/insights`, and `/v2/tags` as needed. Never use legacy `/recs` or `/recommendations`.
- Confirm valid parameters for the chosen `filter.type`; Qloo can silently ignore unsupported parameters.
- All Qloo/Gemini calls run server-side. No `NEXT_PUBLIC_` secret, browser network call with Qloo key, raw key in logs, or key in repo.
- Use a finite agent loop; schema-validate inputs/outputs; no arbitrary web/shell/database write tools.
- A failed Qloo call must be visible as a failed/partial Qloo result. Never silently label baseline output as Qloo-powered.
- Do not place raw Qloo payloads in public JSON fixtures, repo, public static assets, client local storage, or public source control. Server-side private cache is allowed per Qloo's hackathon guide.

## 5. Benchmark integrity

- Use the same user inputs, the same verified activity candidate pool, and the same hard constraints for both arms.
- The baseline must not receive Qloo outputs; the Qloo arm must use observed Qloo results.
- Keep Gemini model/configuration and prompt structure as comparable as possible between arms.
- Show method and provenance. Any metric must be calculated from explicit code or a documented rubric; no made-up numbers or unsubstantiated superiority claim.
- If Qloo is unavailable, show the comparison as unavailable/partial; don't simulate a successful call.

## 6. Security, privacy and quality

- Validate every incoming route body and every tool response.
- Firestore data is private to the authenticated owner; deploy tested security rules.
- Guests cannot write to another user's history. Unauthenticated generation does not require persisting their preferences.
- Ask for device location only as an optional action; manual area selection must work without permission.
- Log request IDs and error codes, not API keys, raw user profiles, raw API payloads or full precise coordinates.
- Limit generation rate/step count and handle timeouts, 401/403/429/5xx and empty results with honest user-facing status.
- Keep accessibility: keyboard access, visible focus, semantic headings/labels, reduced-motion support, sufficient contrast, and touch targets suitable for mobile.

## 7. Completion honesty

- Do not say “tested”, “verified”, “working”, “deployed”, or “complete” unless the relevant command or check actually ran and the result was observed.
- Never skip a failing test silently. Record the exact command, result and blocker.
- Keep README and documentation consistent with actual behavior and deployed environment.
