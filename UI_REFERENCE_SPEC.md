# UI Reference Specification — Visual Source of Truth

## 1. Status and authority

The product owner supplied two image references. They have been copied unchanged into this repository:

- `assets/ui-references/reference-01-event-feed-and-map.jpg` — image with a card-based activity feed and a map screen on lavender background.
- `assets/ui-references/reference-02-mobile-app-style.jpg` — image with three polished mobile app screens using a pale violet/lilac palette, rounded cards and image-led content.

These are the **visual direction** for ApnaRaasta. The PRD controls which features exist. Do not treat every feature shown in the screenshots as a request to implement that feature.

## 2. Visual observations from the references

### Palette

- Dominant soft periwinkle/lavender field in reference 1 (sampled background is approximately `#BEC3FB`).
- Light pastel violet background in reference 2 (sampled dominant pastel is approximately `#E5DBFE`).
- White/light gray surfaces; dark ink text; blue-periwinkle/purple accent for primary actions and selected states.
- Avoid a dark neon look, bright multi-colour gradients, or an unrelated generic admin-dashboard palette.

These sampled values are approximate anchors from compressed screenshots, not permission to invent a different palette. The implementation should inspect the reference images and define a small consistent token set that matches the visible design.

### Components and visual language

- Rounded surfaces and large, soft corner radii for cards and major containers.
- Image-led cards with a clear title, subdued location/metadata rows, and a strong primary action.
- Filter/category choices use compact rounded pills; selected state is visually distinct (dark filled or accent-filled against light pills in the supplied images).
- Strong hierarchy: large short heading; compact supporting text; title and key detail close together; metadata uses smaller, muted typography.
- Subtle borders/shadows rather than heavy outlines.
- White/light floating cards over a quiet light/pastel base.
- Bottom navigation appears in the mobile references, with selected item highlighted. Only include navigation destinations that correspond to approved ApnaRaasta tasks.
- The references use photography and compact metadata to keep cards informative without looking dense.

### Layout observations

- The first reference pairs a vertically scrolling feed with a map discovery screen.
- The second reference uses a mobile application shell, compact headers, card collections, category selectors and a detailed view.
- Use these as cues for spacing, hierarchy, corner treatment and information density—not as a request to reproduce either underlying app.

## 3. Translate the references to ApnaRaasta

Use the references' styling on the following approved product tasks, without inventing unrelated features:

1. Start/entry and guided onboarding.
2. Preference entry and area selection.
3. Loading/progress while Qloo and Gemini work.
4. Main personalized three-step pathway with source-aware activity cards.
5. Alternatives/regenerate and preference adjustment.
6. Separate Qloo-vs-baseline comparison view.
7. Google sign-in prompt and signed-in saved-pathway history.
8. Standard empty, partial, offline/timeout/error and auth states.

The precise layouts of these screens should be derived from the two references and the product flow. Do not add a new visual style or unnecessary navigation. In particular, do not assume a desktop dashboard is desired; mobile is the design priority, desktop responsiveness is required.

## 4. Explicitly do NOT import these reference-only features

- Messaging/chat screens, inbox or DM actions.
- “Going”, RSVP, “Next time”, event check-in, participant counts or friend avatars.
- Premium badge, paid features, purchase flows or subscription UI.
- Create-event/floating plus action.
- Courses, course prices, discount banners, enrollment or education-specific labels.
- Interactive map, pins, route navigation, live map controls or distance-time estimates. Although the first image contains a map, a map is **not** in the approved MVP. The location preference is handled via manual Pune-area selection and optional device location. Ask the owner before adding mapping as a scope change.
- Generic profile/messages tabs unless a later task explicitly approves them. A minimal account/sign-out affordance may be included only where required for Google Auth/history.

## 5. Design implementation constraints

- No new screen or major UI behavior may be justified solely because it looks nice.
- Build responsive real components, not a static replica of the screenshot.
- Match reference spacing/radii/typography and light pastel visual language consistently across all states.
- Prefer one small token set for background, surface, text, muted text, primary, selected chip, border and focus state.
- Use the same component patterns for cards, filter pills, buttons and metadata throughout the app.
- Primary actions must be visually clear but not oversized or repetitive.
- Avoid overusing animation. Respect `prefers-reduced-motion`; transitions should be subtle and fast.
- Use real, legally usable activity imagery from sources that support the specific recommendation. If no suitable verified image exists, use a tasteful category placeholder; never imply a generic stock photo is a photograph of a real venue/event.
- Do not create icons or use emojis as a substitute for a considered interface. Use one consistent icon set if icons are needed.
- Accessibility: semantic elements, keyboard focus, accessible labels, readable contrast, responsive text and touch targets.

## 6. Visual QA gate

Before each phase is complete:

- Compare implemented mobile viewports against the supplied references side-by-side.
- Check compact phone width, typical phone width and desktop width.
- Verify card radius, inner spacing, image crop, chip/button styling, type hierarchy, white surface treatment and accent colour remain coherent.
- Verify all UI still communicates Qloo/data provenance accurately and doesn't use unsupported event/RSVP language.
- Capture screenshots of the actual implementation; do not submit reference images as proof of app completion.

If the agent cannot confidently infer a major detail (e.g. a navigation structure), it must prefer the smallest structure required by the PRD or ask the product owner. It must not invent an extra destination.
