# Anmol Kumar — Portfolio

Personal freelancing portfolio for **Anmol Kumar**, Full Stack Developer &
UI/UX Specialist. Built as a production-quality, conversion-focused site
with a Y2K / neo-brutalist / retro-desktop design identity layered over a
modern, premium foundation.

## Status

**Live at [personal-portfolio-lovat-nu-82.vercel.app](https://personal-portfolio-lovat-nu-82.vercel.app)**
(deployed on Vercel after Phase 13; confirmed by the site owner —
this repository's own sessions have no browser tool to independently
verify a live deployment).

**Phase 14 — Social Presence & Connect Layer: code complete, pending
the database migration and the owner's real social links.** Added a
new `public.social_links` table (same RLS/`is_admin()` security model
as skills/services) plus admin management at `/admin/socials`, a
homepage Connect section, footer social icons, and a terminal
`socials` command — all reading from the same table, all gracefully
showing nothing until real links exist. **No personal URLs were
invented** — the table ships empty; add real GitHub/LinkedIn/email/etc.
links through `/admin/socials` after running the migration. See
"Phase 14" in [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md) for the
full design, the exact migration to run, and its verification queries.
Phases 1–13 (Supabase-backed content, admin CMS, unsaved-changes
navigation guard, production metadata/SEO, deployment prep) are
code-complete; see `docs/PROJECT_STATE.md` for the full phase-by-phase
record and what's been confirmed live vs. not yet independently
verified by this repository's own sessions.

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
| `NEXT_PUBLIC_SITE_URL`                   | Real production URL — used for `metadataBase`, OG/Twitter image URLs, canonical links, sitemap, and robots.txt. **Optional on Vercel** (auto-detects the assigned `*.vercel.app` domain via `VERCEL_PROJECT_PRODUCTION_URL` if unset); set explicitly once a custom domain is attached, or always on a non-Vercel host. Falls back to `http://localhost:3000` in local dev. |

See "Phase 13 Summary" in [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md)
for the full list of what to set in Vercel's dashboard, plus Supabase
and Resend production configuration notes.

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
                            projects/skills/services/socials list+CRUD+reorder
  sitemap.ts, robots.ts    Generated sitemap.xml / robots.txt (published projects only)
  icon.svg, apple-icon.tsx, opengraph-image.tsx, twitter-image.tsx, manifest.ts
                            Site identity: favicon, app icon, social share image
  error.tsx, global-error.tsx, not-found.tsx   Public error/404 boundaries
  ...                      Public routes (App Router)
components/
  layout/, ui/, hero/, sections/, projects/, engagement/, contact/, retro/
  terminal/                Interactive command-line experience
  admin/                   Admin-only UI (forms, lists, badges, bulk actions,
                            reorder, GuardedLink, UnsavedChangesProvider)
data/                     projects.ts, skills.ts, services.ts kept as
                          historical seed reference only — not read at runtime
lib/
  supabase/                Browser/server Supabase clients + session refresh
  admin/                   Server Actions (CRUD, bulk ops, reorder) + shared auth/error/validation helpers
  projects.ts, skills.ts, services.ts, social-links.ts   Public reads — Supabase, RLS-scoped
  service-icons.ts, skill-categories.ts Controlled maps (icon ids, category colors)
  social-icons.ts, social-platforms.ts, social-link-href.ts
                            Controlled social-link icon/platform maps + shared href logic
  site-url.ts              NEXT_PUBLIC_SITE_URL with a local-dev fallback
  og-image.tsx             Shared JSX for the default OG/Twitter share image
hooks/                    use-local-storage, use-crt-mode, use-cursor-trail, use-sound,
                          use-unsaved-changes-warning (beforeunload),
                          use-dirty-form-guard (full admin nav + back/forward guard)
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

**Phase 11 — Unsaved Changes Navigation Guard** · Fixed the Phase 10
known limitation: dirty admin forms are now protected against
`AdminNav` link clicks and the browser back/forward buttons, not just
tab close/refresh and the form's own Cancel button. A new
`UnsavedChangesProvider` (wraps `/admin`'s layout) holds one shared
dirty flag; `useDirtyFormGuard` (used by all three forms in place of
the old `useUnsavedChangesWarning` call) registers it, keeps the
existing `beforeunload` protection, and guards back/forward with a
sentinel `history.pushState` + `popstate` listener (no App Router
navigation-blocking API exists, so this is the standard SPA pattern —
see `docs/PROJECT_STATE.md` for its exact, documented limitation).
`GuardedLink` (`next/link` drop-in) replaces `AdminNav`'s links and
checks the shared dirty flag before navigating. Every discard
confirmation — `AdminNav`, back/forward, and each form's Cancel button
— now goes through one shared, accessible `Modal`-based dialog instead
of `window.confirm()`. No new dependency, no database migration.

**Phase 12 — Production Metadata and Portfolio Polish** · Root layout
gained `metadataBase` (from the new `NEXT_PUBLIC_SITE_URL`, see above),
site-wide Open Graph/Twitter defaults, and a canonical URL; every
public page already had its own title/description and now also sets
its own canonical link. The project case study page's `generateMetadata`
now sets Open Graph/Twitter data from the real project (title, short
description, and the actual cover image when one exists — falling back
to the site-wide default share image when it doesn't; never fabricated).
Replaced the default Next.js favicon with a code-generated retro "AK"
identity (`icon.svg`, `apple-icon.tsx`, `opengraph-image.tsx`,
`twitter-image.tsx` via `next/og`'s bundled `ImageResponse` — no new
dependency) plus a `manifest.ts` web app manifest. Added `app/sitemap.ts`
(published projects only, defense-in-depth filtered even though RLS
already scopes this) and `app/robots.ts` (disallows `/admin`). Added
`app/error.tsx` (friendly public error boundary, reused `Modal`-free
`RetroWindow`) and `app/global-error.tsx` (dependency-free fallback for
a root-layout-level failure). Fixed one real, confirmed bug found while
validating this phase — see "Root Cause: Soft 404 on Unknown Projects"
in `docs/PROJECT_STATE.md`. Small accessibility fix: contact form field
errors now use `role="alert"` so they're announced to screen readers,
not just exposed via `aria-describedby`. No other admin-CMS or
Supabase-facing behavior changed.

**Phase 13 — Production Deployment & Launch Preparation** · Audited
the repository for Vercel/Supabase/Resend production readiness (env
vars, auth flow, image config, Resend sender behavior — see
`docs/PROJECT_STATE.md` for the full findings) and confirmed the
architecture from Phases 1–12 needs no changes to deploy. One code
change: `lib/site-url.ts` now falls back to Vercel's own
`VERCEL_PROJECT_PRODUCTION_URL` when `NEXT_PUBLIC_SITE_URL` is unset,
so metadata/sitemap/robots resolve correctly on the assigned
`*.vercel.app` domain from the first deploy — no custom domain
decision required to launch. **No deployment was performed** — this
session has no Vercel/Supabase/Resend dashboard access; see "Phase 13
Summary" in `docs/PROJECT_STATE.md` for the exact environment variable
list, Supabase/Resend configuration steps, and a production
verification checklist to run through after deploying.

**Phase 14 — Social Presence & Connect Layer** · Added a fifth
Supabase-backed content type, `public.social_links`
(`supabase/migrations/0008_create_social_links_table.sql`, not yet
run), using the exact same `is_admin()`/RLS/GRANT security model as
skills and services. Full admin management at `/admin/socials`
(create/edit/reorder/delete, integrated into the existing `AdminNav`
and unsaved-changes protection — no parallel systems). Publicly: a new
homepage Connect section (`components/sections/connect-section.tsx`,
self-omitting when empty), a compact icon row in the footer, and a new
terminal `socials` command, all reading the same enabled-only data
through one shared `lib/social-links.ts`. Icons are controlled,
CHECK-constrained string ids mapped to *generic* Lucide icons (no
brand logos — lucide-react doesn't ship any, confirmed by inspection)
— matching `lib/service-icons.ts`'s existing pattern, no new icon
dependency. **No personal social URLs were invented** — the table
ships empty; see "Phase 14" in `docs/PROJECT_STATE.md` for the
migration to run and its verification queries.

## Next Steps

Run `supabase/migrations/0008_create_social_links_table.sql` (see
"Migration Handoff — Phase 14" in `docs/PROJECT_STATE.md`), then add
real social links through `/admin/socials`. Beyond that: work through
Phase 13's production verification checklist if not already done, and
set `NEXT_PUBLIC_SITE_URL` explicitly once a custom domain is chosen.
Further candidates: a lightweight
boot/loading sequence, deeper homepage polish, or automated test
coverage — no further phase has been started.
