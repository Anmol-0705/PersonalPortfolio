# Anmol Kumar — Portfolio

Personal freelancing portfolio for **Anmol Kumar**, Full Stack Developer &
UI/UX Specialist. Built as a production-quality, conversion-focused site
with a Y2K / neo-brutalist / retro-desktop design identity layered over a
modern, premium foundation.

## Status

**Phase 5 — Contact Delivery Integration and Retro Interaction Controls: Complete.**

The contact and quote-request forms now submit to a real API route
(`/api/contact`) that validates the request, applies basic spam
protection, and sends email via [Resend](https://resend.com). Live
delivery requires a configured `RESEND_API_KEY` — see Environment
Variables below. The site also ships opt-in retro interaction controls
(CRT scanlines, cursor trail, sound effects), all off by default and
persisted per-browser. See [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md)
for the full implementation record, including what was and wasn't tested
with a live email key.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev)
- [Lucide React](https://lucide.dev) — icons
- [Resend](https://resend.com) — transactional email (server-side only)
- `next/font` — self-hosted Google Fonts (Space Grotesk, VT323)

No CMS, database, ORM, or analytics package is installed.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in real values (never commit
`.env.local`):

| Variable            | Purpose                                              |
| ------------------- | ------------------------------------------------------ |
| `RESEND_API_KEY`    | Resend API key — required for email delivery          |
| `RESEND_FROM_EMAIL` | Verified sender address (or Resend's sandbox sender)   |
| `CONTACT_TO_EMAIL`  | Inbox that receives contact/quote requests             |

Without `RESEND_API_KEY` configured, the contact form still works end to
end (validation, spam checks, UI states) but the API honestly reports a
delivery failure instead of pretending to succeed.

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
app/
  api/contact/route.ts   Server-side contact/quote email delivery
  ...                     Routes (App Router)
components/
  layout/                 Navbar, Footer
  ui/                     Reusable design-system primitives (incl. Modal)
  hero/                   Homepage hero
  sections/                Homepage content sections
  projects/                Project card, grid, media, and case study UI
  engagement/               Quick Sprint calculator, project estimator, tabs
  contact/                   Contact form, quote modal
  retro/                      CRT/trail/sound preferences, floating controls
data/                    Typed static content (site config, projects, services)
lib/                     Shared utilities, estimation logic, email formatting
hooks/                   use-local-storage, use-crt-mode, use-cursor-trail, use-sound
types/                   Shared TypeScript types
docs/                    Project documentation and handoff state
```

## Completed

**Phase 1 — Foundation** · Next.js + TypeScript + Tailwind CSS v4 setup,
design system, reusable UI primitives, route foundation.

**Phase 2 — Core Homepage** · Full homepage: hero, about, services,
skills, featured projects, engagement preview, final CTA.

**Phase 3 — Dynamic Project Showcase** · Typed project data architecture,
full `/projects` listing, statically generated `/projects/[slug]` case
studies.

**Phase 4 — Engagement Selector and Conversion Flow** · Quick Sprint
calculator and Full Build project estimator with transparent, honest
guidance; a quote modal carrying selections into a contact form.

**Phase 5 — Contact Delivery Integration and Retro Interaction Controls**

- Real API-backed email delivery via Resend, with server-side validation,
  a honeypot spam trap, and a lightweight per-IP rate limit
- Contact form only ever shows success after the API confirms delivery —
  never before
- Opt-in CRT scanline overlay, retro cursor trail, and Web Audio UI sound
  effects, all off by default, persisted in `localStorage`, and
  respecting `prefers-reduced-motion`
- Fixed a Modal accessibility issue: `aria-labelledby` now uses a unique
  `useId()`-generated ID per instance instead of a fixed string

## Next Steps

Phase 6 — Interactive Terminal and Command Experience.
