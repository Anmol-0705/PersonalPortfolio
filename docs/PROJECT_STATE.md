# Project State

This document is the authoritative handoff record for AI coordination
across development phases. Update it whenever a phase completes.

## Current Phase

Phase 3 — Dynamic Project Showcase and Case Study Architecture

## Phase Status

Complete

## Last Updated

2026-08-26

## Current Branch

main

## Latest Commit

`feat: add dynamic project showcase` (this commit — see `git log` for the
hash)

## Build Status

PASS — `npm run build` completes successfully. All routes compile,
including `generateStaticParams`-driven static generation of all five
`/projects/[slug]` pages.

## Lint Status

PASS — `npm run lint` reports no errors or warnings.

## Tech Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript 5
- Tailwind CSS v4
- Framer Motion — used in `RetroHero` only
- Lucide React — used in `Navbar`, `Modal`, `ServicesSection`,
  `ProjectsSection` (via `ProjectMedia`/`ProjectCard`), `EngagementSection`,
  `ProjectCaseStudy` (`ArrowLeft`, `ExternalLink`, `Code2` — note: this
  version of `lucide-react` does not export a `Github` icon, so `Code2` is
  used for the "View Code" link instead)
- `next/font/google`: Space Grotesk (sans, headings + body), VT323 (retro
  monospace, labels/system UI only)
- `next/image` — used in `ProjectMedia` for the (currently unused) real
  cover-image path

## Dependencies

Production: `next`, `react`, `react-dom`, `framer-motion`, `lucide-react`.

Dev: `typescript`, `tailwindcss`, `@tailwindcss/postcss`, `eslint`,
`eslint-config-next`, `@types/node`, `@types/react`, `@types/react-dom`.

No new dependencies were added in Phase 3. No CMS, database, image
library, or carousel package is installed.

## Current Directory Structure

```
app/
  about/page.tsx
  contact/page.tsx
  projects/
    page.tsx                 (listing — reads getAllProjects())
    [slug]/page.tsx           (case study — generateStaticParams + notFound)
  services/page.tsx
  layout.tsx
  page.tsx                   (composes the full homepage)
  globals.css
  not-found.tsx
  favicon.ico
components/
  layout/
    navbar.tsx
    footer.tsx
  ui/
    neo-button.tsx
    neo-card.tsx
    retro-window.tsx
    tech-badge.tsx
    toggle.tsx
    modal.tsx
  hero/
    retro-hero.tsx
  sections/
    section-heading.tsx
    about-section.tsx
    services-section.tsx
    skills-section.tsx
    projects-section.tsx      (now reads through lib/projects.ts)
    engagement-section.tsx
    cta-section.tsx
  projects/
    project-card.tsx
    project-grid.tsx
    project-media.tsx
    project-case-study.tsx
data/
  site-config.ts
  projects.ts                 (single source of truth for project content)
lib/
  utils.ts
  projects.ts                 (getAllProjects/getFeaturedProjects/getProjectBySlug)
types/
  project.ts
docs/
  PROJECT_STATE.md
public/                (empty — real project media still pending)
```

Still deferred: `components/engagement/`, `components/terminal/`,
`components/contact/`, `hooks/`, `lib/quote-estimator.ts`, `types/quote.ts`
— all scoped to later phases.

## Routes

| Route              | Status                                              |
| ------------------ | ------------------------------------------------------ |
| `/`                | Full homepage; featured projects now data-driven       |
| `/about`           | Minimal placeholder                                    |
| `/projects`        | **Full listing** — all 5 projects via `ProjectGrid`     |
| `/projects/[slug]` | **Full case study** — statically generated for all 5 slugs, `notFound()` on unknown slugs |
| `/services`        | Minimal placeholder                                    |
| `/contact`         | Minimal placeholder, mailto link only                  |
| `not-found`        | Implemented, styled                                    |

Verified working: `/projects/the-creation-edit`,
`/projects/electrotrans-solutions`, `/projects/sundown-studios`,
`/projects/property-dealer-web-app`, `/projects/teaching-institute-portal`
(all 200), and an unknown slug (404, renders the styled not-found page).

## Project Data Architecture

`types/project.ts` → `data/projects.ts` → `lib/projects.ts` → UI
components → routes, exactly as specified.

- **`types/project.ts`** — `Project` type with `slug`, `title`, `category`,
  `shortDescription`, optional `overview`, `featured`, `order`, optional
  `status`, `technologies: string[]` (empty = unverified, never guessed),
  optional `media` (`coverImage`/`previewImage`/`demoVideo` paths),
  optional `liveUrl`/`githubUrl`, optional `problem`/`approach`/`solution`,
  optional `keyFeatures: string[]`, optional `projectNotes`, optional
  `testimonial`. Every narrative/media/link field is optional by design.
- **`data/projects.ts`** — the five real projects, each with an inline
  comment-level integrity note at the top of the file (see below for the
  per-project breakdown).
- **`lib/projects.ts`** — `getAllProjects()` (sorted by `order`),
  `getFeaturedProjects()`, `getProjectBySlug(slug)`. No
  `getProjectsByCategory()` — no feature currently needs it, and the brief
  said to add it only if genuinely useful.

## Implemented Components (new in Phase 3)

- `components/projects/project-media.tsx` — `ProjectMedia`. Renders a real
  `next/image` when `project.media.coverImage` is set; otherwise renders
  the "MEDIA COMING SOON" placeholder (icon + label wrapped in a
  `role="img"`/`aria-label` container, inner content `aria-hidden`). No
  project currently has a cover image, so every card/case study shows the
  placeholder today — that's expected, not a bug.
- `components/projects/project-card.tsx` — `ProjectCard`. Category, title,
  description, `ProjectMedia`, technology badges (only rendered when
  `technologies.length > 0`), a `FEATURED` tag + accent shadow when
  `project.featured`, and a link to `/projects/[slug]`. Reads only from
  the `Project` object passed in — no duplicated data.
- `components/projects/project-grid.tsx` — `ProjectGrid`. Responsive grid
  over a `Project[]` prop; renders an empty-state message when the array
  is empty instead of a blank section.
- `components/projects/project-case-study.tsx` — `ProjectCaseStudy`. Back
  link, header (category/title/overview/technologies/external links),
  hero `ProjectMedia`, then Problem/Approach/Solution/Key Features/
  Testimonial sections that each render only when their field is present
  — no empty headings, no "N/A" placeholders anywhere.

## Completed Features

- Homepage, `/projects`, and `/projects/[slug]` all read from the same
  `data/projects.ts` through `lib/projects.ts` — no duplicated project
  objects anywhere in the codebase.
- `/projects/[slug]` uses `generateStaticParams()` (all 5 slugs
  pre-rendered at build time) and `generateMetadata()` for per-project
  `<title>`/description; an unknown slug calls `notFound()`.
- Homepage `ProjectsSection` was simplified to compose `ProjectGrid` with
  `getFeaturedProjects()`, preserving its existing visual design (grid,
  "View All Projects" CTA, note about the non-featured projects).
- Accessibility: `ProjectCaseStudy` uses one `h1` and ordered `h2`s per
  section, all interactive elements are real `<a>`/`<button>` elements,
  decorative media/icons are `aria-hidden` with a labelled parent where
  needed, focus rings inherited from Phase 1 primitives.
- Performance: every new component in `components/projects/` is a server
  component; no client JS was added in Phase 3.
- Verified via Playwright: all 5 case study routes plus `/` and
  `/projects` load with zero console/hydration errors; responsive
  screenshots taken at 375px and 1440px for the listing page and two case
  studies (one with verified technologies, one without).

## Project Data Integrity

Per project, exactly what's shown:

| Project | Technologies shown | Source |
| --- | --- | --- |
| The-Creation-Edit | React, Tailwind CSS, Framer Motion | Explicitly provided |
| ElectroTrans Solutions | *(none)* | Not provided — left as an empty array, no badges rendered |
| Sundown Studios | *(none)* | Not provided — left as an empty array, no badges rendered |
| Property Dealer Web App | React, Node.js, PostgreSQL | Explicitly provided |
| Teaching Institute Portal | *(none)* | Not provided — left as an empty array, no badges rendered |

No project has a `liveUrl`, `githubUrl`, or `testimonial` — none were
provided, so `ProjectCaseStudy` renders neither the external-links row nor
a testimonial block for any project (the code supports both whenever real
values are added). `problem`/`approach`/`solution`/`keyFeatures` are
written as general, honest descriptions grounded in each project's known
category and description — no invented metrics, client names, user
counts, or business outcomes appear anywhere in `data/projects.ts`.

## Architecture Decisions

- **Empty `technologies` array represents "unverified," not an error.**
  Every technology-badge-rendering component checks `.length > 0` before
  rendering the section at all, so an unknown stack degrades to "no
  badges shown" rather than a placeholder or fabricated guess.
- **`ProjectMedia` takes the whole `Project`, not just a media object**,
  so it can build meaningful alt text / `aria-label`s from `project.title`
  without the caller having to pass redundant props.
- **`ProjectCaseStudy` iterates a small `narrativeSections` array** for
  Problem/Approach/Solution instead of three copy-pasted conditional
  blocks — the three fields are genuinely parallel in shape and purpose.
- **`lucide-react` has no `Github` export in the installed version** —
  discovered at build time (Turbopack failed with a clear "export doesn't
  exist" error). Swapped to `Code2` for the "View Code" affordance rather
  than adding a new icon dependency.
- **No `getProjectsByCategory()`.** Nothing in Phase 3 needs
  category-based filtering; adding it now would be unused abstraction.
- **README.md rewritten via a direct UTF-8 heredoc again**, continuing
  the practice established in Phase 2 after the UTF-16-on-disk incident.
  Verified with `file README.md` before committing.

## Documentation Updated

- **README.md**: status moved to Phase 3 complete; tech stack, directory
  tree (added `types/`, `components/projects/`), and completed-features
  list updated; next steps now point to Phase 4.
- **docs/PROJECT_STATE.md**: this file — full Phase 3 rewrite covering
  the data architecture, new components, route status, project data
  integrity table, architecture decisions, validation results, and next
  phase.

## Known Issues

- None of the five projects have real media assets yet; every card and
  case study shows the "MEDIA COMING SOON" placeholder. The `media` field
  and `ProjectMedia` component are ready for real images/video whenever
  they're provided (e.g. `public/projects/the-creation-edit/cover.webp`).
- Three of the five projects (ElectroTrans Solutions, Sundown Studios,
  Teaching Institute Portal) have no verified technology stack and
  intentionally show no tech badges. If the real stack is confirmed
  later, add it to `data/projects.ts` — no component changes needed.
- No automated tests exist yet (out of scope for Phase 3).
- Favicon is still the Next.js default.

## Next Planned Phase

Phase 4 — Engagement Selector and Conversion Flow

(Not started. Do not begin without explicit instruction.)

## Rules for Future Development

- Do not create a nested `PersonalPortfolio` directory or a second Git
  repository.
- Do not add `react-hook-form`, `zod`, a CMS, a database, or an email
  provider until the phase that explicitly calls for them.
- Project content changes belong in `data/projects.ts` only — never
  re-duplicate project objects inside a component again.
- Never populate `technologies`, `liveUrl`, `githubUrl`, or `testimonial`
  with invented values. Leave them empty/undefined until a real value is
  confirmed.
- Keep raw hex colors out of components — use the semantic tokens or
  palette tokens defined in `app/globals.css`.
- Keep VT323 (or any future pixel/retro font) restricted to labels,
  metadata, and system/terminal UI — never body paragraphs.
- Respect `prefers-reduced-motion` in any new Framer Motion usage — use
  `useReducedMotion` for JS-driven loops, not just CSS.
- Before adding a `lucide-react` icon import, confirm the export exists
  in the installed version (`node -e "console.log(Object.keys(require('lucide-react')))"`)
  — brand icons like `Github` are not guaranteed to exist.
- Before committing any Markdown file, verify its encoding with
  `file <path>` — this repo has hit a UTF-16-on-disk issue with
  README.md more than once.
- Update this file and `README.md` at the end of every phase so they stay
  accurate — do not let them describe unimplemented features as done.
