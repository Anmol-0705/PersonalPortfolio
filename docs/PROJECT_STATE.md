# Project State

This document is the authoritative handoff record for AI coordination
across development phases. Update it whenever a phase completes.

## Current Phase

Phase 9 — Admin Skills and Services Management

## Phase Status

**CODE IMPLEMENTED. DATABASE MIGRATIONS CREATED BUT NOT YET RUN.**

`npm run lint` and `npm run build` both pass. Public-page graceful-empty
behavior was verified live against the actual dev server with the
`skills`/`services` tables genuinely not existing yet (see "Live
Verification Performed" below) — that is the strongest possible test of
the zero-rows case, since the tables don't exist at all right now.

What was **not** live-tested, because the three new migrations
(`0005`–`0007`) have not been run yet: admin create/edit/delete for
skills and services, and the populated (non-empty) rendering of the
public Skills/Services sections and the terminal's `skills`/`services`
commands. These depend on the tables existing and cannot be exercised
until the site owner runs the migrations below.

## Last Updated

2026-08-26

## Current Branch

main

## Live Verification Performed (this session)

With the dev server running and `public.skills`/`public.services` not
yet created:

- `GET /` → `200`, page renders, Skills/Services sections simply absent
  (not broken, not an error page).
- `GET /services` → `200`, page renders without its services grid.
- `GET /admin`, `/admin/skills`, `/admin/services`, `/admin/skills/new`
  (unauthenticated) → `307` redirect to `/admin/login`, consistent with
  existing project routes.
- `GET /projects`, `/contact`, `/about` → `200`, unaffected.
- Server log confirmed the actual error being handled gracefully:
  `[getAllSkills] Supabase query error: { code: 'PGRST205', message:
  "Could not find the table 'public.skills' in the schema cache" }` —
  logged, not swallowed, and the page still rendered correctly.

This confirms the "zero skills / zero services" requirement and the
no-crash requirement empirically, not just by code review. Admin CRUD
and populated-state rendering still need the site owner's follow-up
testing after running the migrations (see "Migration Handoff" below).

## Phase 9 Summary

Added `public.skills` and `public.services` — the third and fourth
Supabase-backed content types alongside `public.projects`, using the
exact same security model (`is_admin()`, RLS + explicit GRANTs, no
service-role key). Extended `/admin` with full CRUD for both, and
switched the public homepage Skills/Services sections, the standalone
`/services` page, and the terminal's `skills`/`services` commands from
static `data/*.ts` imports to these tables — Supabase is now the single
runtime source of truth for projects, skills, and services alike.

### Database Design

**`public.skills`**: `id uuid pk`, `name text not null`,
`category text not null`, `sort_order integer not null default 0`,
`created_at`/`updated_at timestamptz`. No `published` flag — unlike
projects, skills have no draft workflow, matching the original
`data/skills.ts` (everything in it was always public).

Category *display color* (the purple/green/blue/pink badge variants the
original `data/skills.ts` hardcoded per group) is **not** a column — it's
a controlled `Record<string, TechBadgeVariant>` in `lib/skill-categories.ts`,
keyed by category text, with a fallback (`"yellow"`, not used by the
original four) for any new category the admin adds. This keeps a
UI-styling concern out of the database, the same reasoning as the
service icon map.

Category *and skill order* are both reconstructed from one column:
`lib/skills.ts`'s `groupByCategory()` walks all skills sorted by
`sort_order` (tie-broken by `id`) and builds each category group the
first time it's seen. This means the flattened seed order (`0`–`15`,
matching `data/skills.ts`'s nested array exactly) alone determines both
"which categories appear in what order" and "which skills appear in
what order within a category" — no separate category-ordering column
needed, and it still groups correctly even if an admin later inserts a
skill whose `sort_order` interleaves with another category's.

**`public.services`**: `id uuid pk`, `title text not null`,
`description text not null`,
`icon text not null check (icon in ('rocket','layers','pen-tool','wrench'))`,
`sort_order integer not null default 0`, `created_at`/`updated_at timestamptz`.

No `label` column (the original data had `"SVC_01"` etc.) — that's
derived at render time from position (`SVC_${index+1}` after ordering by
`sort_order`), since it was always exactly sequential numbering, never
independently-set content.

**Icon storage — the specific ask from this phase's brief:** `icon` is a
plain string, never a component or anything dynamically imported.
Defense in depth, two layers:
1. **Database:** a `CHECK` constraint restricting it to exactly the four
   ids matching the original `data/services.ts` icons — `rocket`,
   `layers`, `pen-tool`, `wrench`. No other value can even be inserted.
2. **Application:** `lib/service-icons.ts` exports a fixed
   `Record<ServiceIconId, LucideIcon>` — the *only* place a string
   becomes an actual icon component. The admin form is a set of buttons
   over this exact list (not a text input), so there is no path — UI or
   database — for an arbitrary string to become a rendered icon.

### RLS and Security

Identical pattern to `public.projects`, applied to both new tables:
- **Public** (`to public`, i.e. `anon` + `authenticated`): `SELECT`
  using `(true)` — no draft state, everything is always public.
- **Admin** (`to authenticated`, gated by `public.is_admin()`): `INSERT`,
  `UPDATE`, `DELETE`.
- **Non-admin authenticated users**: covered by the same `is_admin()`
  check as the admin policies — no separate authorization system.

Table-level `GRANT`s are explicit and were not skipped this time:
`grant select on public.skills, public.services to anon, authenticated;`
plus `grant insert, update, delete ... to authenticated;` — the exact
grant category that was missing for `public.projects` in Phase 8 (see
that section below) is included from the start here.

`public.is_admin()` and every existing policy on `public.projects` are
**untouched**.

### Data Architecture

`lib/skills.ts` / `lib/services.ts` — the only code that queries these
tables. Both log real Postgrest errors (never swallow them, per the
project's established pattern) and fall back to `[]` on failure, which
is what makes the empty-table case render gracefully instead of
crashing.

`lib/admin/skill-actions.ts` / `lib/admin/service-actions.ts` — Server
Actions, one file per resource (matching `project-actions.ts`'s
granularity). Both now import shared `requireAdmin()` (`lib/admin/auth.ts`)
and `describeError()` (`lib/admin/errors.ts`), extracted from
`project-actions.ts` in this phase rather than triplicated — the same
security check copy-pasted three times was judged a worse risk than a
small, behavior-preserving refactor (project-actions.ts's exported
behavior is unchanged; verified by `npm run build`).

`data/skills.ts` and `data/services.ts` are kept, but repurposed as
historical/reference-only (matching `data/projects.ts`'s precedent from
Phase 7) — nothing in the app imports them anymore
(`grep`-verified). Supabase is the single runtime source of truth for
all three content types.

### Public Site Integration

- `components/sections/skills-section.tsx`, `services-section.tsx` —
  now `async` Server Components calling `getSkillGroups()`/`getServices()`
  directly (same pattern `projects-section.tsx` already used). Each
  returns `null` when its table is empty, so an empty section never
  renders a bare heading with nothing under it.
- `app/services/page.tsx` — same change; the services grid is
  conditionally rendered only when non-empty.
- `app/page.tsx` — now fetches skills/services (alongside the existing
  projects fetch) to pass into `TerminalSection`, since the terminal's
  commands are pure functions and can't fetch on their own (see below).

### Terminal Integration

The terminal's `run()` functions are deliberately pure (no I/O, no
imports of live data) per the Phase 6 architecture decision recorded
below in "Rules for Future Development." `TerminalCommandContext` was
extended with `skillGroups` and `services` (alongside the existing
`projects`), fetched server-side in `app/page.tsx` and threaded through
`TerminalSection` → `Terminal` → `runTerminalCommand()`. The `skills`
and `services` commands now read from context instead of importing
`data/skills.ts`/`data/services.ts` directly, and both print a friendly
message instead of an empty block when their list is empty — no second
copy of content, no impure command functions.

### Admin Panel

Routes (matching the existing `/admin/projects/...` convention exactly):
`/admin/skills`, `/admin/skills/new`, `/admin/skills/[id]/edit`,
`/admin/services`, `/admin/services/new`, `/admin/services/[id]/edit`.

New `components/admin/admin-nav.tsx` — a small top-of-page nav
(Projects / Skills / Services) added to all six project/skill/service
list and edit pages, so the three sections are easy to move between.
`/admin`'s stat row now also shows Total Skills and Total Services
alongside the existing project counts.

Each `[id]/edit` route uses the same in-admin-layout "not found" card
introduced for projects in Phase 8, instead of the site-wide 404.

Delete requires confirmation via the existing `Modal`-based pattern
(`DeleteSkillButton`/`DeleteServiceButton`, matching
`DeleteProjectButton`'s structure).

Sort order: a plain integer field, defaulting to "append at end"
(current row count) on create — no drag-and-drop, matching the brief's
explicit "do not overengineer" instruction and the existing project
pattern (`createProject` does the same thing).

### Build / Lint Status (Phase 9)

Build: PASS. Lint: PASS. TypeScript: PASS (all part of `npm run build`).

### Tech Stack / Dependencies

Unchanged from Phase 8 — no new dependency was added. Skills/services
use the same `@supabase/ssr` + `@supabase/supabase-js` clients, the same
Next.js Server Actions pattern, and plain browser APIs (native `<input
list>` for category suggestions, native buttons for icon selection) —
no React Hook Form, no Zod, no CMS package, nothing new in `package.json`.

### New Routes (Phase 9)

`/admin/skills`, `/admin/skills/new`, `/admin/skills/[id]/edit`,
`/admin/services`, `/admin/services/new`, `/admin/services/[id]/edit` —
all under the existing `(dashboard)` layout, so they inherit the same
auth gate as `/admin` and `/admin/projects/...`.

### Rules for Future Development (additions from Phase 9)

- Skill/service category colors and icon-to-component mapping live in
  `lib/skill-categories.ts` / `lib/service-icons.ts` — controlled maps,
  not database columns. If a new service icon is ever needed, add it to
  both the `SERVICE_ICON_IDS` array/`serviceIconMap` in
  `lib/service-icons.ts` *and* the `CHECK` constraint on
  `public.services.icon` (a new migration) — the two must stay in sync.
- `data/skills.ts`/`data/services.ts` are historical-only. Do not add
  new runtime imports of them; add rows via `/admin/skills`/`/admin/services`
  instead.
- `requireAdmin()`/`describeError()` now live in `lib/admin/auth.ts`/
  `lib/admin/errors.ts` — any new admin Server Action file should import
  these rather than redefining them.
- The terminal's command functions must stay pure (no imports of live
  data, no I/O) — any new data a command needs should be added to
  `TerminalCommandContext` and fetched server-side in `app/page.tsx`,
  the same way `skillGroups`/`services` were added in this phase.

## Migration Handoff — Phase 9

**Run these three, in this exact order, in the Supabase SQL editor:**

1. **`supabase/migrations/0005_create_skills_table.sql`**
   Creates `public.skills`, enables RLS, adds the public-read and
   admin-write policies, and grants the correct table privileges to
   `anon`/`authenticated`. Nothing to edit first.
2. **`supabase/migrations/0006_create_services_table.sql`**
   Same, for `public.services`, plus the `CHECK` constraint on `icon`.
   Nothing to edit first.
3. **`supabase/migrations/0007_seed_skills_and_services.sql`**
   Inserts the 16 skills and 4 services currently in `data/skills.ts`/
   `data/services.ts`, verbatim, with `sort_order` matching their
   original array order. Only runs if each table is currently empty
   (safe to re-run; won't duplicate or overwrite admin edits made after
   seeding). Nothing to edit first — but it must run *after* `0005`/`0006`
   since it inserts into those tables.

**Verification queries** (run after all three):

```sql
-- Expect 16 rows, sort_order 0-15, categories Frontend/Backend/
-- Data & Services/DevOps & Deployment in that order.
select name, category, sort_order from public.skills order by sort_order;

-- Expect 4 rows, sort_order 0-3, icon in the four known ids.
select title, icon, sort_order from public.services order by sort_order;

-- Confirm RLS + grants: run with the anon key (e.g. from a fresh
-- browser tab, logged out) — should return the same 16/4 rows, no
-- permission-denied error.
select count(*) from public.skills;
select count(*) from public.services;
```

After running these, please verify live (this session could not):
create/edit/delete a skill and a service from `/admin/skills` and
`/admin/services`, and confirm the homepage Skills/Services sections and
`/services` render the seeded content.

## Historical: Phase 8 — Project Editing Fix and Image Uploads

The sections below (Root Cause through Known Limitations for Phase 8)
are the unmodified record from when Phase 8 closed out. Kept for
history; still accurate for `public.projects` and Storage, which Phase 9
did not touch.

### Root Cause: Edit Project / Empty Public Pages

**Confirmed bug, not a guess.** `public.projects` had RLS policies but
was missing a table-level `GRANT SELECT` for the `anon` role. Verified
by querying the live project directly with the anon key, bypassing the
Next.js app entirely:

```
status: 401 Unauthorized
error: {
  "code": "42501",
  "message": "permission denied for table projects",
  "hint": "Grant the required privileges to the current role with:
           GRANT SELECT ON public.projects TO anon;"
}
```

**Why this matters:** in Postgres, a `GRANT` and an RLS policy are two
separate layers. RLS only filters *rows* for a role that already holds
the base table privilege — it does not grant that privilege. The task
brief confirmed `GRANT SELECT, INSERT, UPDATE, DELETE ... TO authenticated`
had already been run, but the equivalent `GRANT SELECT ... TO anon` had
not. Every anonymous (public visitor) query failed at the privilege
layer before the "Public can view published projects" RLS policy ever
ran — explaining why `/`, `/projects`, and `/projects/[slug]` showed
empty/404 results even after the seed migration.

**Fixed** by `supabase/migrations/0004_grant_anon_select_projects.sql` —
a single `GRANT`, no RLS policy, no `is_admin()`, no authorization
architecture touched.

**Relationship to the reported Edit bug:** the admin dashboard and Edit
page both run under the `authenticated` role (which already had its
grant), so this specific bug does not by itself explain "Edit does
nothing while logged in as admin." Two things were fixed alongside it
that materially change how any *remaining* Edit failure would present:

1. `lib/projects.ts`'s three read functions (`getAllProjects`,
   `getProjectBySlug`, `getProjectById`) previously did
   `if (error || !data) return undefined` with **no logging at all** —
   a genuine Postgrest error (like the one above) and a legitimate "row
   doesn't exist" were indistinguishable, and both were silently
   swallowed. They now `console.error` the real error server-side
   before falling back, and only fall back on missing *data*, not on an
   error being present. If Edit is still broken after running `0004`,
   the exact Postgrest error will now appear in the server terminal
   the moment it's reproduced.
2. The Edit page called `notFound()` on a missing project, which renders
   the **site-wide** `app/not-found.tsx` — outside the admin layout
   entirely, no link back to `/admin`. That's easy to mistake for "the
   Edit button is broken" even when it's working exactly as coded (e.g.
   a stale link to an already-deleted project). It now renders an
   inline "Project Not Found" card that stays inside the admin chrome
   with a link back to the dashboard.

Resolution confirmed: after `0004` was run, the site owner verified Edit
works end to end (load existing values, change fields, save, persists
after refresh).

### Root Cause: Cover Image Uploaded But Not Displaying

A second, unrelated bug surfaced once Storage upload itself worked:
uploads succeeded, the object was publicly readable at its direct
Supabase URL, but the image never rendered inside the app. Network tab
showed the failing request going through Next's `/_next/image`
optimizer (`/_next/image?url=...`), returning `400`.

**Two layered issues, diagnosed by curling the running dev server's own
`/_next/image` endpoint directly:**

1. **Stale dev server process.** The first `400` returned the body
   `"url" parameter is not allowed` — Next's exact message when a
   remote image's hostname isn't in the *running* server's
   `images.remotePatterns`. The file on disk was already correct; Next
   only reads `next.config.ts` at process startup, so a config edit
   without a full dev-server restart has no effect. Restarting picked
   up the config.
2. **NAT64 DNS false positive.** After restarting, the server's own log
   showed a different, more specific error:
   `hostname resolved to private IP` with addresses
   `64:ff9b::6812:260a` / `64:ff9b::ac40:95f6`. This machine's network
   resolves `*.supabase.co` using NAT64/DNS64 — a standard mechanism
   (RFC 6052, well-known prefix `64:ff9b::/96`) that synthesizes IPv6
   addresses embedding a real public IPv4 address, here Cloudflare's
   `104.18.38.10` / `172.64.149.246` (who fronts Supabase Storage).
   Next.js 16 added an SSRF guard to the image optimizer that
   misclassifies this NAT64 prefix as a private/local address and
   blocks the fetch — a false positive: opening the same URL directly
   in a browser (which resolves the hostname differently) worked fine
   throughout.

**Fix:** `next.config.ts` sets `images.dangerouslyAllowLocalIP: true`,
with an inline comment explaining why. This is Next's own documented
escape hatch for exactly this class of false positive (their error
message names this flag directly, and the docs cite "split-horizon DNS"
environments as the intended use case). It does not broaden what can be
fetched — `images.remotePatterns` still restricts every optimized-image
request to this one Supabase hostname and the `/storage/v1/object/public/**`
path; this flag only stops the (here, incorrect) private-IP check from
blocking an otherwise-already-allowed, genuinely public host.

**Confirmed working live** by the site owner after restarting the dev
server with this config in place.

### Phase 8 Required Manual Steps — all completed

All five SQL migrations have been run against the live Supabase project
and confirmed (project editing and image upload both work end to end,
which is only possible with all of these applied):

1. `0000_ensure_admin_user.sql` — links the Supabase Auth admin user to
   `public.admin_users`.
2. `0001_projects_slug_unique.sql` — unique constraint on `projects.slug`.
3. `0002_seed_existing_projects.sql` — inserted the original 5 projects.
4. `0003_project_images_storage.sql` — created the `project-images`
   Storage bucket (public-read) and its admin-only write policies.
5. `0004_grant_anon_select_projects.sql` — the anon-grant bug fix.

No further manual SQL is pending. Any future schema/policy/storage
change should be added as a new numbered migration file rather than
editing these in place.

### Build Status

PASS — `npm run build` completes with no TypeScript errors.

### Lint Status

PASS — `npm run lint` reports no errors or warnings.

### Database Architecture

`public.projects` — unchanged schema from Phase 7 (see git history for
the full column list). This phase added no columns; `cover_image`
(already existed, previously unused) now actually gets populated with a
Supabase Storage public URL.

`public.admin_users`, `public.is_admin()`, and every RLS policy on
`public.projects` — **untouched** in this phase, per the brief's
explicit instruction not to redesign authorization without a discovered
problem. The one discovered problem (the missing anon `GRANT`) is a
privilege grant, not an RLS or authorization change.

### Storage Architecture

**Bucket:** `project-images`, public-read (`storage.buckets.public = true`).

**Security model** (`supabase/migrations/0003_project_images_storage.sql`):
- `SELECT` — `to public`, any object in the bucket. Explicit policy for
  API-level reads, in addition to the bucket's public flag which already
  serves objects by URL.
- `INSERT` / `UPDATE` / `DELETE` — `to authenticated`, gated by the same
  `public.is_admin()` function used everywhere else. No new
  authorization concept introduced.
- The service-role/secret key is **not** used anywhere for Storage — all
  uploads go through the browser's Supabase client, carrying the
  logged-in admin's session, enforced by the policies above.

**Stated tradeoff (see the migration file's own comment for the full
version):** a public bucket serves any object by URL to anyone who has
that URL, with no concept of "is the owning project published." This
migration does not weaken `public.projects`' RLS — an unpublished
project's `cover_image` URL is never returned by any public query, so
there's no discoverable public path to a draft's image. Someone who
already has the exact URL (e.g. a leaked link) could still load it
directly. If that residual exposure needs closing later, the fix is a
private bucket + short-lived signed URLs generated only for published
rows — deliberately not built now, to keep this phase's scope clean. See
Known Limitations.

**File naming:** `projects/{project-id}/{crypto.randomUUID()}.{ext}` —
never the visitor's original filename. Since a project has no id until
its row exists, `cover_image` uploads only happen after the row does:

- **Create:** a picked file is staged locally (object URL preview only,
  nothing uploaded) until `createProject` returns a real id, then it's
  uploaded and saved in one follow-up step. If that follow-up fails, the
  project row still exists — the form reports a distinct
  "project created, but image upload failed" message rather than a
  blanket failure, and the image can be added later from Edit.
- **Edit:** the project id already exists, so replace/remove happen
  immediately on interaction, independent of the "Save Changes" button
  for the rest of the fields.

**Ordering, to avoid inconsistent states:**
- *Replace:* upload the new file → save the new URL to the DB → only
  then best-effort delete the old object. Never deletes the old file
  before the new one is confirmed both uploaded and saved.
- *Remove:* save `cover_image = null` to the DB first (so the public
  fallback shows immediately, never a broken image) → then best-effort
  delete the object. Delete failures are logged, not surfaced — an
  orphaned file is a minor cleanup cost, not a correctness problem.
- *Delete project:* `deleteProject` now also best-effort removes the
  project's cover image from Storage after the row is gone.

### Image Upload Component

`components/admin/project-image-upload.tsx` (`"use client"`) — file
picker + drag-and-drop, PNG/JPG/WEBP only, 5MB max, local preview via
`URL.createObjectURL`, and distinct states/messages for: invalid file
type, file too large, upload failure, permission failure (detected from
the Storage error message), and database-save failure (upload succeeded
but persisting the URL didn't — the orphaned object is cleaned up
automatically). No new dependency — plain browser File/drag-and-drop
APIs plus the existing `@supabase/supabase-js` client.

`lib/supabase/storage.ts` — shared upload/delete/validate/path-parsing
helpers, used by both the component (live edit-mode uploads) and
`components/admin/project-form.tsx` (the create-mode staged-upload step).

### Public Image Display

`components/projects/project-media.tsx` was already written to render
`project.media.coverImage` via `next/image` when present, and the
existing "MEDIA COMING SOON" placeholder when absent — **no changes were
needed there**; it was already correct, just never fed a real URL before
this phase. `next.config.ts` allowlists Supabase Storage's public object
URLs for this project's specific hostname via `images.remotePatterns`
(required by `next/image` for any remote host) and sets
`images.dangerouslyAllowLocalIP: true` to work around this network's
NAT64 false positive (see Root Cause above). Alt text
(`"${project.title} preview"`) was already meaningful — untouched.

**Confirmed rendering correctly** on the homepage featured cards,
`/projects` listing, and `/projects/[slug]` case study page.

### Files Created

- `lib/supabase/storage.ts`
- `components/admin/project-image-upload.tsx`
- `supabase/migrations/0003_project_images_storage.sql`
- `supabase/migrations/0004_grant_anon_select_projects.sql`

### Files Modified

- `lib/projects.ts` — error logging instead of silent swallowing in all
  three read functions.
- `lib/admin/project-actions.ts` — consistent error logging/dev-detail
  across all five actions (`describeError` helper); added
  `updateProjectCoverImage`; `ActionResult` now carries `id`;
  `deleteProject` cleans up the project's Storage object.
- `app/admin/(dashboard)/projects/[id]/edit/page.tsx` — in-context "not
  found" state instead of the site-wide 404.
- `components/admin/project-form.tsx` — integrates
  `ProjectImageUpload`; create-mode staged-upload-after-save flow.
- `next.config.ts` — `images.remotePatterns` for Supabase Storage, plus
  `images.dangerouslyAllowLocalIP: true` for the NAT64 false positive.

### Public Visibility Rules (verified by code review, re-confirmed this phase)

- `getAllProjects` / `getFeaturedProjects` / `getProjectBySlug` apply
  zero manual `published` filtering — RLS decides what rows a query
  returns based on the caller's role, transparently, for every caller.
- Homepage featured section = `getFeaturedProjects()` = `getAllProjects()`
  (RLS-scoped) filtered to `featured`. An unpublished-but-featured
  project is invisible to anonymous requests before the `.featured`
  filter ever runs, because RLS already excluded the row.
- Admin dashboard = `getAllProjects()` under an authenticated
  `is_admin()` session = every row, published or not.

## Known Limitations

**Phase 9:**

- **The three new migrations have not been run yet** — until they are,
  `/admin/skills` and `/admin/services` show empty lists (correctly, not
  broken), and the public Skills/Services sections and `/services`
  render nothing. See "Migration Handoff — Phase 9" above.
- Admin create/edit/delete for skills and services, and populated-state
  public rendering, have **not** been live-tested by this session (no
  browser tool, tables don't exist yet). Needs the site owner's
  follow-up after migrating.
- Skill categories are free text with a `<datalist>` of the four known
  categories as suggestions, not a hard-constrained enum — intentional
  (categories are just a label, not a security concern, unlike icons),
  but means a typo'd category creates its own group with the fallback
  badge color rather than erroring.
- No automated test suite covering the new Server Actions (consistent
  with the rest of the project — none exist anywhere yet).

**Carried over from Phase 7/8:**

- No automated test suite; Next.js default favicon.
- Storage is public-read with no per-row signed-URL gating — acceptable
  for a portfolio site's cover images, not a general-purpose
  private-file pattern.
- `images.dangerouslyAllowLocalIP: true` is specific to this development
  machine's NAT64 network resolution — harmless in production.
- Responsive breakpoint testing (375/768/1440px) has not been
  independently performed by this session for any phase — no browser
  tool available.
- `createProject`/`createSkill`/`createService`'s `sort_order` all
  derive from the current row count — fine for a single-admin workflow,
  not safe under concurrent inserts (not a realistic scenario here).
- Development-mode error detail (`[DEV] <code>: <message>`) appended to
  action error messages is gated by `NODE_ENV !== "production"` and
  therefore never reaches a production build — intentional, the
  project's standing answer to "don't swallow real errors," now used
  consistently across project/skill/service actions.

## Next Phase

Immediate: the site owner runs the three Phase 9 migrations and verifies
admin skill/service CRUD and public rendering end to end (see "Migration
Handoff" above) — this is verification of already-implemented code, not
new development.

Beyond that, no specific next phase has been assigned. Candidates still
open: a lightweight boot/loading sequence, deeper homepage content/SEO
polish, or automated test coverage. Do not begin any of these without
explicit instruction.
