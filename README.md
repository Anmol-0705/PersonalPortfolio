# Anmol Kumar — Portfolio

Personal freelancing portfolio for **Anmol Kumar**, Full Stack Developer &
UI/UX Specialist. Built as a production-quality, conversion-focused site
with a Y2K / neo-brutalist / retro-desktop design identity layered over a
modern, premium foundation.

## Status

**Phase 4 — Engagement Selector and Conversion Flow: Complete.**

The homepage, `/projects` and `/projects/[slug]`, `/services`, and
`/contact` are all fully built. Visitors can configure a Quick Sprint or
Full Build engagement, get honest (non-binding) guidance on scope, and
submit a quote request or general message through a native contact form.
**Real email/API delivery is not implemented yet** — submissions currently
resolve through a documented client-side placeholder. `/about` remains a
minimal placeholder. See [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md)
for the full implementation record.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev) — hero and engagement-panel transitions
- [Lucide React](https://lucide.dev) — icons
- `next/font` — self-hosted Google Fonts (Space Grotesk, VT323)

No CMS, database, backend framework, or email provider is wired up yet.

## Local Setup

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Available Scripts

| Script          | Description                        |
| --------------- | ----------------------------------- |
| `npm run dev`   | Start the local development server |
| `npm run build` | Create a production build          |
| `npm run start` | Serve the production build         |
| `npm run lint`  | Run ESLint                         |

## Architecture Overview

```
app/                  Routes (App Router)
components/
  layout/              Navbar, Footer
  ui/                  Reusable design-system primitives (incl. Modal)
  hero/                Homepage hero
  sections/            Homepage content sections
  projects/            Project card, grid, media, and case study UI
  engagement/          Quick Sprint calculator, project estimator, tabs
  contact/             Contact form, quote modal
data/                  Typed static content (site config, projects, services)
lib/                   Shared utilities and data-access/estimation logic
types/                 Shared TypeScript types
docs/                  Project documentation and handoff state
```

Design tokens live in [`app/globals.css`](app/globals.css). Project
content lives in [`data/projects.ts`](data/projects.ts). Engagement
estimation logic lives in [`lib/quote-estimator.ts`](lib/quote-estimator.ts)
and is deliberately kept out of components.

## Completed

**Phase 1 — Foundation**

- Next.js + TypeScript + Tailwind CSS v4 project setup
- Global design system, reusable UI primitives (`NeoButton`, `NeoCard`,
  `RetroWindow`, `TechBadge`, `Toggle`, `Modal`), Navbar/Footer, route
  foundation, typed site configuration

**Phase 2 — Core Homepage**

- Full homepage: hero, about, services, skills, featured projects,
  engagement preview, final CTA

**Phase 3 — Dynamic Project Showcase**

- Typed project data architecture (`types/project.ts` → `data/projects.ts`
  → `lib/projects.ts`), reusable project UI, full `/projects` listing,
  statically generated `/projects/[slug]` case studies

**Phase 4 — Engagement Selector and Conversion Flow**

- Quick Sprint calculator and Full Build project estimator, each backed by
  transparent, deterministic estimation logic (`lib/quote-estimator.ts`) —
  no binding prices, no fabricated math
- Accessible `EngagementSelector` tabs connecting both flows, embedded on
  the homepage engagement section
- `QuickQuoteModal` that carries the user's selections into a native
  `ContactForm` (no re-entering choices)
- Real `/contact` page and minimally expanded `/services` page
- Honest submission UX: no backend exists yet, and the UI says so

## Next Steps

Phase 5 — Contact Delivery Integration and Retro Interaction Controls:
real email/API delivery for the contact and quote flow, plus opt-in retro
interaction controls (CRT toggle, cursor trail, sound).
