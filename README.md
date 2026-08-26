# Anmol Kumar — Portfolio

Personal freelancing portfolio for **Anmol Kumar**, Full Stack Developer &
UI/UX Specialist. Built as a production-quality, conversion-focused site
with a Y2K / neo-brutalist / retro-desktop design identity layered over a
modern, premium foundation.

## Status

**Phase 6 — Interactive Terminal and Command Experience: Complete.**

The site now includes an optional, discoverable retro terminal (opened
from a compact homepage teaser) that lets visitors explore the portfolio
by typing commands — `help`, `about`, `skills`, `projects`, `services`,
`hire`, `contact`, and more. It's a data-driven layer on top of existing
content, not a second copy of it, and it never replaces normal site
navigation. Real contact/quote email delivery (Resend) has now been
manually tested end-to-end with a live API key and confirmed working.
See [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md) for the full
implementation record.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev)
- [Lucide React](https://lucide.dev) — icons
- [Resend](https://resend.com) — transactional email (server-side only)
- `next/font` — self-hosted Google Fonts (Space Grotesk, VT323)

No new dependency was added for the terminal — it's built with plain
React and the existing Modal/design system.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in real values (never commit
`.env.local`):

| Variable            | Purpose                                              |
| ------------------- | ------------------------------------------------------ |
| `RESEND_API_KEY`    | Resend API key — required for email delivery          |
| `RESEND_FROM_EMAIL` | Verified sender address (or Resend's sandbox sender)   |
| `CONTACT_TO_EMAIL`  | Inbox that receives contact/quote requests             |

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
  layout/, ui/, hero/, sections/, projects/, engagement/, contact/, retro/
  terminal/               Interactive command-line experience
data/                    Typed static content (site config, projects, services, skills)
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
full `/projects` listing, statically generated case studies.

**Phase 4 — Engagement Selector and Conversion Flow** · Quick Sprint
calculator and Full Build project estimator with honest guidance and a
quote modal.

**Phase 5 — Contact Delivery and Retro Interaction Controls** · Real
Resend-backed email delivery (server-validated, spam-guarded) — **live
delivery confirmed working**. Opt-in CRT scanlines, cursor trail, and
sound effects, all persisted per-browser.

**Phase 6 — Interactive Terminal and Command Experience**

- `components/terminal/` — a data-driven command terminal reusing the
  existing Modal, project data, services data, and site configuration
- Commands: `help`, `about` (alias `whoami`), `skills`, `projects`
  (optionally `projects <slug>`, with clickable results), `services`
  (alias `work`), `hire`, `contact` (alias `email`), `home`, `theme`,
  `date`, `clear` (alias `cls`), plus a hidden `sudo hire` easter egg
- Command history via ArrowUp/ArrowDown, friendly unknown-command
  handling, keyboard-accessible project links, focus management on
  open/close

## Next Steps

Recommended next phase: a lightweight boot/loading sequence or deeper
homepage polish pass — no further phase has been started.
