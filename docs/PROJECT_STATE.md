# Project State

This document is the authoritative handoff record for AI coordination
across development phases. Update it whenever a phase completes.

## Current Phase

Phase 8 — Project Editing Fix and Image Uploads

## Phase Status

**Complete and confirmed working live by the site owner.** All five SQL
migrations have been run against the live Supabase project. Admin
project editing (create/edit/publish/unpublish/delete) and Supabase
Storage-backed cover images (upload/replace/remove, public display) have
all been verified end to end in the real browser — not just by code
review or `npm run build`. `npm run lint` and `npm run build` both pass
on the final state.

This session still has no browser automation tool and never handled
admin credentials — every fix in this phase was diagnosed via static
code review, direct REST/DNS probes against the live Supabase project
and this network's resolver, and server log inspection, then confirmed
working by the site owner after applying each fix. That division of
labor (this session diagnoses and fixes in code; the site owner runs
migrations, restarts the dev server, and verifies in-browser) held for
the whole phase and is why it could close out cleanly.

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

Resolution confirmed: after `0004` was run, the site owner verified Edit
works end to end (load existing values, change fields, save, persists
after refresh).

## Root Cause: Cover Image Uploaded But Not Displaying

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

## Required Manual Steps — all completed

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
this phase. `next.config.ts` allowlists Supabase Storage's public object
URLs for this project's specific hostname via `images.remotePatterns`
(required by `next/image` for any remote host) and sets
`images.dangerouslyAllowLocalIP: true` to work around this network's
NAT64 false positive (see Root Cause above). Alt text
(`"${project.title} preview"`) was already meaningful — untouched.

**Confirmed rendering correctly** on the homepage featured cards,
`/projects` listing, and `/projects/[slug]` case study page.

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
- `next.config.ts` — `images.remotePatterns` for Supabase Storage, plus
  `images.dangerouslyAllowLocalIP: true` for the NAT64 false positive.

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
- `images.dangerouslyAllowLocalIP: true` is specific to this
  development machine's NAT64 network resolution. It's harmless in
  production (a normal hosting environment won't resolve Supabase's
  hostname to a NAT64 address, so the flag simply won't matter there),
  but if a future environment legitimately needs the private-IP guard
  active, revisit this — the real fix would be forcing IPv4-first DNS
  resolution in the Node process instead of disabling the guard, which
  was deliberately not pursued here to keep this phase's scope small.
- Responsive breakpoint testing (375/768/1440px) was not independently
  performed by this session — no browser tool available. Not flagged as
  broken, just not separately re-verified beyond the site owner's
  general "confirmed working live."
- `createProject`'s `sort_order` is derived from the current row count —
  fine for a single-admin workflow, not safe under concurrent inserts
  (unchanged from Phase 7, still not a realistic scenario here).
- Development-mode error detail (`[DEV] <code>: <message>`) appended to
  action error messages is gated by `NODE_ENV !== "production"` and
  therefore never reaches a production build — kept intentionally (not
  a leftover) as this phase's answer to "don't swallow real errors."

## Next Phase

No specific next phase has been assigned. Candidates from Phase 7,
still open: a lightweight boot/loading sequence, deeper homepage
content/SEO polish, or automated test coverage. Do not begin any of
these without explicit instruction.
