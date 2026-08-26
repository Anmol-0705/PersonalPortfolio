# Anmol Kumar — Portfolio

Personal freelancing portfolio for **Anmol Kumar**, Full Stack Developer &
UI/UX Specialist. Built as a production-quality, conversion-focused site
with a Y2K / neo-brutalist / retro-desktop design identity layered over a
modern, premium foundation.

## Status

**Phase 10 — Admin CMS Polish: code complete, pending your live
verification.** The admin panel is now a real dashboard (real Supabase
stats, recent projects) with search/filter, bulk actions, and accessible
reordering for projects/skills/services, plus unsaved-changes warnings
on every form. Phases 1–9 (Supabase-backed projects/skills/services,
Storage-backed images, admin auth) are confirmed working live. See
[`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md) for the full record.

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
  admin/                   Private admin panel: dashboard (/admin), then
                            projects/skills/services list+CRUD+reorder
  ...                      Public routes (App Router)
components/
  layout/, ui/, hero/, sections/, projects/, engagement/, contact/, retro/
  terminal/                Interactive command-line experience
  admin/                   Admin-only UI (forms, lists, badges, bulk actions, reorder)
data/                     projects.ts, skills.ts, services.ts kept as
                          historical seed reference only — not read at runtime
lib/
  supabase/                Browser/server Supabase clients + session refresh
  admin/                   Server Actions (CRUD, bulk ops, reorder) + shared auth/error/validation helpers
  projects.ts, skills.ts, services.ts   Public reads — Supabase, RLS-scoped
  service-icons.ts, skill-categories.ts Controlled maps (icon ids, category colors)
hooks/                    use-local-storage, use-crt-mode, use-cursor-trail, use-sound,
                          use-unsaved-changes-warning
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

**Phase 8 — Project Editing Fix and Image Uploads** · Fixed a missing
`GRANT SELECT ... TO anon` on `public.projects` that was silently
breaking every public page, and fixed the admin Edit page's "not found"
UX. Added Supabase Storage-backed project cover images — upload,
replace, and remove, with admin-only write policies and public read —
including working around a network-specific Next.js image optimizer
false positive (see `docs/PROJECT_STATE.md`). **Confirmed working live**:
admin project editing and cover image upload/replace/remove both verified
end to end.

**Phase 9 — Admin Skills and Services Management** · Added `public.skills`
and `public.services` tables (same RLS/`is_admin()` model as projects) and
extended `/admin` with skills and services management, so the tech stack
and services list are editable without touching code. The homepage
Skills/Services sections and the terminal's `skills`/`services` commands
now read from Supabase instead of static files. **Confirmed working live.**

**Phase 10 — Admin CMS Polish** · `/admin` is now a real dashboard (real
project/skill/service stats, no fabricated metrics, a Recent Projects
list, quick-create links) with the full project list moved to
`/admin/projects`. Added search + status/featured filtering, accessible
status badges (published/draft/featured/image), bulk publish/unpublish/
feature/delete for projects, and keyboard-accessible Move Up/Down
reordering for projects, skills (scoped to category), and services — no
new dependency. Every admin form now warns before an unsaved change is
lost, without ever warning about the cover image (which already saves
independently).

## Next Steps

A lightweight boot/loading sequence or deeper homepage polish pass — no
further phase has been started.
