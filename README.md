# Anmol Kumar — Portfolio

Personal freelancing portfolio for **Anmol Kumar**, Full Stack Developer &
UI/UX Specialist. Built as a production-quality, conversion-focused site
with a Y2K / neo-brutalist / retro-desktop design identity layered over a
modern, premium foundation.

## Status

**Phase 8 — Project Editing Fix and Image Uploads: Implemented, pending
your migration run.** Fixed a table-level permissions gap that broke
every public page, fixed the admin Edit flow's error visibility, and
added Supabase Storage-backed cover image upload/replace/remove. See
[`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md) for the full record,
including the SQL migrations that still need to be run manually.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Supabase](https://supabase.com) — Postgres, Auth, Row Level Security
- [Framer Motion](https://motion.dev)
- [Lucide React](https://lucide.dev) — icons
- [Resend](https://resend.com) — transactional email (server-side only)
- `next/font` — self-hosted Google Fonts (Space Grotesk, VT323)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in real values (never commit
`.env.local`):

| Variable                                | Purpose                                                    |
| ---------------------------------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`               | Supabase project URL                                        |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`   | Supabase publishable (anon) key — safe for the browser       |
| `RESEND_API_KEY`                         | Resend API key — required for email delivery                |
| `RESEND_FROM_EMAIL`                      | Verified sender address (or Resend's sandbox sender)         |
| `CONTACT_TO_EMAIL`                       | Inbox that receives contact/quote requests                   |

The Supabase secret/service-role key is intentionally never used by this
app — every admin operation runs through the logged-in user's session,
enforced by RLS.

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
  api/contact/route.ts     Server-side contact/quote email delivery
  admin/                   Private admin panel (login, dashboard, project CRUD)
  ...                      Public routes (App Router)
components/
  layout/, ui/, hero/, sections/, projects/, engagement/, contact/, retro/
  terminal/                Interactive command-line experience
  admin/                   Admin-only UI (forms, dashboard controls)
data/                     Typed static content (site config, services, skills)
                          projects.ts kept as historical seed reference only
lib/
  supabase/                Browser/server Supabase clients + session refresh
  admin/project-actions.ts Server Actions for project CRUD (admin-only)
  projects.ts              Public project reads — Supabase, RLS-scoped
hooks/                    use-local-storage, use-crt-mode, use-cursor-trail, use-sound
types/                    Shared TypeScript types (incl. hand-written Supabase types)
supabase/migrations/      SQL to run manually in the Supabase SQL editor
docs/                     Project documentation and handoff state
proxy.ts                  Session refresh + /admin auth gate (Next 16's Proxy)
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

**Phase 7 — Supabase-Backed Project Admin** · Project data now lives in
`public.projects` (Supabase Postgres) instead of a static file, protected
by Row Level Security. A private `/admin` panel (Supabase Auth, no public
signup) lets the site owner create, edit, publish/unpublish, and delete
projects through a UI matching the existing design system, instead of
editing source code.

**Phase 8 — Project Editing Fix and Image Uploads** · Found and fixed a
missing `GRANT SELECT ... TO anon` on `public.projects` (RLS policies
alone don't grant table access — this was silently breaking every public
page). Fixed the admin Edit page to show a clear "not found" state
inside the admin layout instead of the site-wide 404. Added Supabase
Storage-backed project cover images: upload, replace, and remove, with
admin-only write policies and public read.

## Next Steps

1. **Run the SQL migrations** in `supabase/migrations/`, in order
   (`0000` through `0004`), via the Supabase SQL editor — see
   `docs/PROJECT_STATE.md` for exactly what each one does and which are
   likely already applied. `0004` in particular is the fix for the
   anon-grant bug and should be run immediately.
2. A lightweight boot/loading sequence or deeper homepage polish pass.
