# ApnaRaasta (अपना रास्ता)
> **From Your Interests to Your People.**  
> A Qloo-powered, Gemini-agentic cultural discovery and community participation platform built for Pune, India.

---

## 1. Overview

**ApnaRaasta** helps residents, newcomers, and students in Pune convert cultural tastes into practical, grounded **three-step community pathways**. Rather than overwhelming users with disconnected event search results or ungrounded generative hallucinations, ApnaRaasta pairs **Qloo's cultural intelligence taste graph** with a **curated, source-verified local activity catalogue** and a **bounded Gemini orchestrator**.

### The 3-Step Pathway Philosophy
1. **Step 1: Approachable Start** — Low-barrier, gentle introduction (e.g. silent reading, free open screenings, community photowalks).
2. **Step 2: Shared Interest** — Deeper engagement in a focused creative discipline or interest group.
3. **Step 3: Recurring Community** — Sustained weekly/monthly community rhythms and routines for lasting connection.

---

## 2. Core Architecture

```mermaid
flowchart TD
  U[Responsive Web UI: Next.js + Tailwind] -->|Preferences: Categories, Area, Budget, Rhythm| API[Next.js Server API Routes]
  API --> V[Zod Validation & Deterministic Constraints]
  V --> Q[Qloo Adapter: /search, /v2/tags, /v2/insights]
  Q --> C[Pune Activity Catalogue: Verified Local Records]
  C --> G[Gemini Bounded Orchestrator: Tool-Calling & Schema Validation]
  G --> O[Validated 3-Step Pathway + Alternatives]
  O --> U
  U -->|Google Sign-In| FA[Firebase Authentication]
  U -->|Save & Read History| FS[(Firestore: users/{uid}/pathways)]
```

---

## 3. Key Capabilities

- **Cultural Signal Grounding (Qloo API)**:
  - Resolves taste queries (artists, authors, films) via `/search` and `/v2/tags`.
  - Queries cultural place and venue insights in Pune via `GET /v2/insights` with `feature.explainability=true`.
  - Connects taste signals to Pune physical spaces and community groups without exposing keys or raw payloads.
- **Bounded Gemini Orchestrator**:
  - Operates on a strict candidate pool derived from deterministic constraints.
  - Generates exactly 3 sequential steps plus valid alternatives.
  - Employs strict JSON schemas; hallucinatory IDs are programmatically rejected.
- **Fair Comparison Engine (`/compare`)**:
  - Benchmarks the Qloo-informed pathway against a generic AI baseline arm.
  - Evaluates both arms against the **exact same user preferences** and **same verified candidate pool**.
  - Computes objective, verifiable metrics (candidate pool size, verified source count, constraint compliance, category coverage) with honest disclaimers.
- **Owner-Scoped Persistence (Firebase & Firestore)**:
  - Guest exploration requires no authentication.
  - Google sign-in enables saving pathways to `users/{uid}/pathways/{pathwayId}`.
  - Production-hardened Firestore Security Rules (`firestore.rules`) block cross-user access, anonymous tokens, and payload exhaustion.
- **Reference-Matched Design**:
  - Derived from supplied visual references (`assets/ui-references/`): soft periwinkle/lavender canvas (`#EAEBFA`), rounded-3xl floating cards, pill selectors, and clean mobile-first navigation dock.

---

## 4. Approved Activity Categories in Pune

1. **Music & Films**: NFAI Film Circle, Raah Cultural Baithaks, Aashayan Film Club.
2. **Photography & Art**: Gyaan Adab Studio, Pune Photowalkers Collective, TIFA Working Studios.
3. **Books & Board Games**: Pagdandi Bookstore Cafe, Pune Board Gamers Guild, Silent Book Club Pune.
4. **Food Experiences**: Blue Tokai KP Coffee Cuppings, Camp Heritage Bakery Walk, Pune Sourdough Guild.
5. **Outdoor Activities**: Vetal Tekdi Nature Walk, Pune Urban Cyclists, Boulder Vibe Climbing.
6. **Volunteering**: Anandvan Urban Forest Initiative, Jeev Raksha Animal Care, Teach for Pune.

Every record in `src/data/puneActivities.ts` has a verifiable `sourceName`, `sourceUrl`, `verifiedAt` timestamp, and explicit notes on known vs. unknown fields.

---

## 5. Getting Started Locally

### Prerequisites
- Node.js `v18+` (Tested on `v22.23.2`)
- npm `v9+` (Tested on `v10.9.8`)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sooubh/apnaraasta.git
   cd apnaraasta
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```
   Add your keys to `.env.local`:
   ```ini
   QLOO_API_KEY=your_qloo_hackathon_key
   QLOO_BASE_URL=https://hackathon.api.qloo.com
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-2.0-flash

   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_web_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Verification and Test Scripts

Run the comprehensive test suite and validation gates:

```bash
# Run unit & integration tests (Vitest)
npm test

# Type-check TypeScript without emit
npm run typecheck

# Lint source code
npm run lint

# Production build
npm run build
```

---

## 7. Security & Privacy

- **Server-Side Provider Secrets**: `QLOO_API_KEY` and `GEMINI_API_KEY` are strictly server-side environment variables and are never bundled into client scripts.
- **No Raw Qloo Storage**: In accordance with the Qloo hackathon guidelines, raw provider response payloads are normalized and never committed to source control or saved to public Firestore documents.
- **Firestore Owner Isolation**: Rules enforce `request.auth.uid == userId` for all read, write, and delete operations on `/users/{userId}/pathways/{pathwayId}`.

---

## 8. License

Licensed under the [Apache License, Version 2.0](LICENSE).
