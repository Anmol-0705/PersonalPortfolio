# Project State

This document is the authoritative handoff record for AI coordination
across development phases. Update it whenever a phase completes.

## Current Phase

Phase 8 — Project Editing Fix and Image Uploads

## Phase Status

Code implemented and validated (lint + build + static/log-based
diagnosis). **Not yet fully live** — five SQL migration files exist in
`supabase/migrations/` and none of them can be executed by this session
(no DB execution tool is available; every migration in this repo has
always required the site owner to run it manually in the Supabase SQL
editor). See "Required Manual Steps" below — `0004` in particular is a
confirmed bug fix and should be run first.

Live browser verification (actually clicking through Login → Edit →
Save, and Upload → Replace → Remove) could **not** be performed by this
session — there is no browser automation tool available and no admin
credentials were provided (nor should they be pasted into chat). Findings
below are backed by static code review, a full `npm run build`/`lint`
pass, and one direct, reproducible finding confirmed against the live
Supabase project's REST API (see Root Cause below) — not a click-through
of the admin UI. The site owner should perform the EDIT TEST and IMAGE
TEST flows from the phase brief and report back.

## Last Updated

2026-08-26

## Current Branch

main

## Root Cause: Edit Project / Empty Public Pages

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

If Edit is still broken after running `0004`, the fix is very likely a
five-minute diagnosis from the new server log line — please reproduce
and share it.

## Required Manual Steps

Run these in the Supabase SQL editor, **in order**. `0000`–`0002` were
introduced in Phase 7 and may already be applied if the site owner ran
them then — check `select * from public.projects;` returns 5 rows and
`select * from public.admin_users;` returns your admin user before
re-running. `0003` and `0004` are new in this phase and have **not**
been run by any session.

1. `0000_ensure_admin_user.sql` — links your Supabase Auth user to
   `public.admin_users` (edit the placeholder email first if not
   already customized).
2. `0001_projects_slug_unique.sql` — unique constraint on `projects.slug`.
3. `0002_seed_existing_projects.sql` — inserts the original 5 projects.
4. `0003_project_images_storage.sql` — creates the `project-images`
   Storage bucket (public-read) and its admin-only write policies. New
   this phase.
5. **`0004_grant_anon_select_projects.sql`** — the bug fix above. New
   this phase, and the most urgent: without it, public pages stay
   broken regardless of anything else.

## Build Status

PASS — `npm run build` completes with no TypeScript errors.

## Lint Status

PASS — `npm run lint` reports no errors or warnings.

## Database Architecture

`public.projects` — unchanged schema from Phase 7 (see git history for
the full column list). This phase added no columns; `cover_image`
(already existed, previously unused) now actually gets populated with a
Supabase Storage public URL.

`public.admin_users`, `public.is_admin()`, and every RLS policy on
`public.projects` — **untouched** in this phase, per the brief's
explicit instruction not to redesign authorization without a discovered
problem. The one discovered problem (the missing anon `GRANT`) is a
privilege grant, not an RLS or authorization change.

## Storage Architecture

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

## Image Upload Component

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

## Public Image Display

`components/projects/project-media.tsx` was already written to render
`project.media.coverImage` via `next/image` when present, and the
existing "MEDIA COMING SOON" placeholder when absent — **no changes were
needed there**; it was already correct, just never fed a real URL before
this phase. `next.config.ts` now allowlists Supabase Storage's public
object URLs (`https://*.supabase.co/storage/v1/object/public/**`) via
`images.remotePatterns`, which `next/image` requires for any remote host.
Alt text (`"${project.title} preview"`) was already meaningful — untouched.

## Files Created

- `lib/supabase/storage.ts`
- `components/admin/project-image-upload.tsx`
- `supabase/migrations/0003_project_images_storage.sql`
- `supabase/migrations/0004_grant_anon_select_projects.sql`

## Files Modified

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
- `next.config.ts` — `images.remotePatterns` for Supabase Storage.

## Public Visibility Rules (verified by code review, re-confirmed this phase)

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

- Carried over from Phase 7: no automated test suite; Next.js default
  favicon.
- Storage is public-read with no per-row signed-URL gating (see Storage
  Architecture's stated tradeoff above) — acceptable for a portfolio
  site's cover images, not a general-purpose private-file pattern.
- Live click-through testing (login, edit, upload, replace, remove,
  responsive breakpoints) was not performed by this session — no
  browser tool, no credentials. The EDIT TEST, IMAGE TEST, VISIBILITY
  TEST, SECURITY TEST, and RESPONSIVE TEST sections of the phase brief
  should be run by the site owner after applying `0003` and `0004`.
- `createProject`'s `sort_order` is derived from the current row count —
  fine for a single-admin workflow, not safe under concurrent inserts
  (unchanged from Phase 7, still not a realistic scenario here).
- Development-mode error detail (`[DEV] <code>: <message>`) appended to
  action error messages is gated by `NODE_ENV !== "production"` and
  therefore never reaches a production build — kept intentionally (not
  a leftover) as this phase's answer to "don't swallow real errors."

## Next Phase

Recommend: after the site owner confirms `0004` fixes public pages and
Edit works end-to-end (or reports the new log line if it doesn't), a
short follow-up to remove the now-unneeded dev-error-detail branches
would only make sense if the team decides they're no longer wanted —
otherwise no action needed there. Beyond that, no specific next phase
was assigned; candidates from Phase 7 (boot/loading sequence, deeper
homepage polish, automated tests) remain open.
