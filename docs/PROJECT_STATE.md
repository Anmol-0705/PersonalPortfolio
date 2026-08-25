# Project State

This document is the authoritative handoff record for AI coordination
across development phases. Update it whenever a phase completes.

## Current Phase

Phase 2 — Core Homepage

## Phase Status

Complete

## Last Updated

2026-08-26

## Current Branch

main

## Latest Commit

`feat: build core portfolio homepage` (this commit — see `git log` for
the hash)

## Build Status

PASS — `npm run build` completes successfully. All routes compile
(`/`, `/about`, `/projects`, `/projects/[slug]`, `/services`, `/contact`,
`/_not-found`).

## Lint Status

PASS — `npm run lint` reports no errors or warnings.

## Tech Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript 5
- Tailwind CSS v4
- Framer Motion — used in `RetroHero` (staggered entrance, subtle infinite
  float on decorative elements, gated by `useReducedMotion`)
- Lucide React — used in `Navbar`, `Modal`, `ServicesSection`,
  `ProjectsSection`, `EngagementSection`
- `next/font/google`: Space Grotesk (sans, headings + body), VT323 (retro
  monospace, labels/system UI only)

## Dependencies

Production: `next`, `react`, `react-dom`, `framer-motion`, `lucide-react`.

Dev: `typescript`, `tailwindcss`, `@tailwindcss/postcss`, `eslint`,
`eslint-config-next`, `@types/node`, `@types/react`, `@types/react-dom`.

No new dependencies were added in Phase 2. No CMS, database, ORM, email
provider, form library, or state-management library is installed.
`react-hook-form` and `zod` remain deferred. Redux is listed as an
existing skill in the Skills section but is **not** installed — it is not
used by this codebase.

## Current Directory Structure

```
app/
  about/page.tsx
  contact/page.tsx
  projects/
    page.tsx
    [slug]/page.tsx
  services/page.tsx
  layout.tsx
  page.tsx                 (composes the full homepage)
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
    section-heading.tsx    (shared heading, not in original target list)
    about-section.tsx
    services-section.tsx
    skills-section.tsx
    projects-section.tsx
    engagement-section.tsx
    cta-section.tsx
data/
  site-config.ts
lib/
  utils.ts
docs/
  PROJECT_STATE.md
public/                (empty — assets added as needed in future phases)
```

Directories still deferred to later phases: `components/projects/`,
`components/engagement/`, `components/terminal/`, `components/contact/`,
`hooks/`, `types/`, `data/projects.ts`, `lib/projects.ts`,
`lib/quote-estimator.ts`. The featured-project data used on the homepage
is intentionally kept local to `projects-section.tsx` (not promoted to
`data/projects.ts`) so Phase 3's dynamic project architecture can define
that shape without reworking Phase 2 code.

## Routes

| Route              | Status                                          |
| ------------------ | ------------------------------------------------ |
| `/`                | **Full homepage** — hero through final CTA       |
| `/about`           | Minimal placeholder                              |
| `/projects`        | Minimal placeholder                              |
| `/projects/[slug]` | Minimal placeholder, dynamic param wired         |
| `/services`        | Minimal placeholder                              |
| `/contact`         | Minimal placeholder, mailto link only            |
| `not-found`        | Implemented, styled                              |

The homepage's "View Project" CTAs link to `/projects/[slug]` using real
project slugs (e.g. `/projects/the-creation-edit`); that route already
renders its Phase 1 placeholder, so nothing fabricated is linked.

## Implemented Components (new in Phase 2)

- `components/hero/retro-hero.tsx` — `RetroHero`. Client component.
  Two-column layout: eyebrow/status, headline, subtext, availability
  indicator, primary/secondary CTAs, and a real stats strip on the left;
  a floating `RetroWindow` "system profile" panel with decorative
  floating `TechBadge` stickers (hidden below `sm`) on the right.
  Staggered entrance animation and a slow infinite float on the
  decorative elements, both wrapped in `MotionConfig reducedMotion="user"`
  and gated additionally via `useReducedMotion` for the JS-driven loops.
- `components/sections/section-heading.tsx` — small shared
  eyebrow/title/description pattern reused by every section for visual
  consistency. Not in the original target file list; added because six
  sections needed the identical heading treatment.
- `components/sections/about-section.tsx` — value-proposition copy next
  to a `RetroWindow` "capabilities.sys" panel. No photo (per instruction).
- `components/sections/services-section.tsx` — four `NeoCard`s (icon,
  label, title, description) for the four defined services, with a hover
  lift effect.
- `components/sections/skills-section.tsx` — `TechBadge` grid grouped
  into Frontend / Backend / Data & Services / DevOps & Deployment.
- `components/sections/projects-section.tsx` — three featured project
  cards (of five real projects) with placeholder media area, category,
  description, tech pills, and a "View Project" link to the existing
  `/projects/[slug]` route; a note plus "View All Projects" link to
  `/projects` covers the remaining two.
- `components/sections/engagement-section.tsx` — two `NeoCard` engagement
  options (Quick Sprint, Full Build) with real pricing/scope copy and
  CTAs to `/contact`. No interactive calculator.
- `components/sections/cta-section.tsx` — final conversion section on an
  accent-colored background with the `scanlines` utility for texture.

## Completed Features

- Full homepage composed in `app/page.tsx` from `RetroHero` +  six section
  components, in the required order: Hero (with integrated trust/stats),
  About, Services, Skills, Featured Projects, Engagement, Final CTA.
- All copy uses the real information provided (name, role, experience,
  stats, service descriptions, project names/descriptions, engagement
  pricing) — no fabricated clients, revenue, testimonials, or URLs.
- Homepage is responsive from 320px through desktop; verified via
  Playwright screenshots at 375px and 1440px, plus a manual mobile-nav
  interaction check.
- Accessibility: semantic heading order (`h1` in hero, `h2` per section,
  `h3` per card), all CTAs are real `<a>`/`<button>` elements (no
  clickable divs), decorative icons/dots are `aria-hidden`, keyboard
  focus rings inherited from Phase 1 primitives, motion respects
  `prefers-reduced-motion`.
- Performance: only `RetroHero` is a client component; all six section
  components and `app/page.tsx` are server components with no client JS.

## Architecture Decisions

- **Featured-project data lives in `projects-section.tsx`, not
  `data/projects.ts`.** Phase 3 owns the real project data architecture;
  inventing that shape now risked conflicting with Phase 3's design.
- **`SectionHeading` extracted as a shared component.** Six sections
  needed an identical eyebrow/title/description pattern; duplicating that
  markup six times would have been worse than one small, justified
  addition beyond the original file list.
- **Trust/Quick Stats integrated into the hero**, not a standalone
  section file. The target architecture's `components/sections/` list
  did not include a stats section, and the brief allowed "immediately
  after or integrated with the hero."
- **Only the hero is a client component.** Framer Motion is scoped to
  `RetroHero`; every other new section is a server component using CSS
  transitions for hover states, keeping the homepage close to zero added
  client JS beyond the hero and existing Navbar/Modal/Toggle.
- **`MotionConfig reducedMotion="user"` + `useReducedMotion`.** CSS-level
  `prefers-reduced-motion` handling from Phase 1 doesn't reach
  JS-driven Framer Motion transforms, so the hero explicitly checks
  reduced-motion before starting its infinite float loops.
- **View Project CTAs link to the real `/projects/[slug]` route** instead
  of a disabled button, since that route already exists and renders a
  placeholder — linking to it is not a fabricated destination.
- **README.md encoding bug found and fixed.** The file had reverted to
  UTF-16 on disk (visible as a binary diff in Phase 1's commit); Phase 2
  rewrote it via a direct UTF-8 heredoc and verified with `file
  README.md` before committing. Worth checking again if README.md ever
  shows as a binary diff.

## Known Issues

- No automated tests exist yet (none were in scope for Phase 2).
- Project preview tech-stack pills for ElectroTrans Solutions, Sundown
  Studios, and Teaching Institute Portal use Anmol's general stack
  (React, Tailwind CSS, Framer Motion, Node.js) as reasonable
  representative tags, since specific per-project stacks weren't provided
  for those three. Only The-Creation-Edit and the Property Dealer Web App
  had explicit stacks given. Revisit in Phase 3 if exact stacks differ.
- `public/` is still empty; all project media uses a placeholder "MEDIA
  COMING SOON" treatment pending real assets.
- Favicon is still the Next.js default.

## Next Planned Phase

Phase 3 — Project Showcase and Dynamic Project Architecture

(Not started. Do not begin without explicit instruction.)

## Rules for Future Development

- Do not create a nested `PersonalPortfolio` directory or a second Git
  repository.
- Do not add `react-hook-form`, `zod`, a CMS, a database, or an email
  provider until the phase that explicitly calls for them.
- Keep raw hex colors out of components — use the semantic tokens or
  palette tokens defined in `app/globals.css`.
- Keep VT323 (or any future pixel/retro font) restricted to labels,
  metadata, and system/terminal UI — never body paragraphs.
- `bg-grid` and `scanlines` are opt-in utilities; do not apply either
  globally or make them continuous/expensive.
- Respect `prefers-reduced-motion` in any new Framer Motion usage — use
  `useReducedMotion` for JS-driven loops, not just CSS.
- When Phase 3 introduces `data/projects.ts` / `lib/projects.ts` /
  `types/project.ts`, migrate the featured-project data currently local
  to `projects-section.tsx` into that architecture rather than
  maintaining two sources of project data.
- Before committing any Markdown file, verify its encoding with
  `file <path>` — this repo has hit a UTF-16-on-disk issue with
  README.md before.
- Update this file and `README.md` at the end of every phase so they stay
  accurate — do not let them describe unimplemented features as done.
