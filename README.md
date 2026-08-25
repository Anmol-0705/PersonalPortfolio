# Anmol Kumar — Portfolio

Personal freelancing portfolio for **Anmol Kumar**, Full Stack Developer &
UI/UX Specialist. Built as a production-quality, conversion-focused site
with a Y2K / neo-brutalist / retro-desktop design identity layered over a
modern, premium foundation.

## Status

**Phase 3 — Dynamic Project Showcase: Complete.**

The homepage, the full `/projects` listing, and dynamic `/projects/[slug]`
case study pages are all live and driven by a single typed project data
source. `/about`, `/services`, and `/contact` remain minimal placeholders.
The contact form and interactive features (terminal, engagement
calculator, quote modal, etc.) are not yet built. See
[`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md) for the full
implementation record.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev) — hero entrance/float animations
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
  ui/                  Reusable design-system primitives
  hero/                Homepage hero
  sections/            Homepage content sections
  projects/            Project card, grid, media, and case study UI
data/                  Typed static content (site config, project data)
lib/                   Shared utilities and data-access functions
types/                 Shared TypeScript types
docs/                  Project documentation and handoff state
```

Design tokens (colors, typography, neo-brutalist and retro utilities) live
in [`app/globals.css`](app/globals.css). Project content lives in
[`data/projects.ts`](data/projects.ts) and is the single source of truth
for the homepage preview, `/projects`, and every `/projects/[slug]` page.

## Completed

**Phase 1 — Foundation**

- Next.js + TypeScript + Tailwind CSS v4 project setup
- Global design system: semantic color tokens, typography, focus/selection
  styling, container/grid/scanline utilities, reduced-motion support
- Reusable UI primitives: `NeoButton`, `NeoCard`, `RetroWindow`, `TechBadge`,
  `Toggle`, `Modal`
- Site-wide `Navbar` and `Footer`
- Route foundation: `/`, `/about`, `/projects`, `/projects/[slug]`,
  `/services`, `/contact`, and a custom `not-found` page
- Centralized, typed site configuration (`data/site-config.ts`)

**Phase 2 — Core Homepage**

- Hero section with entrance/float animation, availability status, and
  real stats (3+ years, 20+ projects, remote worldwide)
- About, Services, Skills & Technology, Featured Projects, Engagement
  Models, and Final CTA sections
- All homepage content sourced from real project information — no
  fabricated clients, metrics, or URLs

**Phase 3 — Dynamic Project Showcase**

- Typed project data architecture: `types/project.ts` → `data/projects.ts`
  → `lib/projects.ts` → UI components → routes
- Reusable `ProjectCard`, `ProjectGrid`, `ProjectMedia`, and
  `ProjectCaseStudy` components
- Full `/projects` listing page and statically generated `/projects/[slug]`
  case study pages for all five real projects, with a proper 404 for
  unknown slugs
- Homepage featured-projects section now reads from the same data source
  instead of local duplicated data
- Only verified technologies are shown per project; nothing about a
  project's stack, clients, or outcomes is fabricated

## Next Steps

Phase 4 — Engagement Selector and Conversion Flow: the interactive
engagement calculator, quote modal, and related conversion features.
