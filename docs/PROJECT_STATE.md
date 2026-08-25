# Project State

This document is the authoritative handoff record for AI coordination
across development phases. Update it whenever a phase completes.

## Current Phase

Phase 1 — Foundation

## Phase Status

Complete

## Last Updated

2026-08-26

## Current Branch

main

## Latest Commit

`feat: initialize portfolio foundation` (this commit — see `git log` for
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
- Framer Motion (installed, not yet used in any component)
- Lucide React (used in `Navbar` and `Modal`)
- `next/font/google`: Space Grotesk (sans, headings + body), VT323 (retro
  monospace, labels/system UI only)

## Dependencies

Production: `next`, `react`, `react-dom`, `framer-motion`, `lucide-react`.

Dev: `typescript`, `tailwindcss`, `@tailwindcss/postcss`, `eslint`,
`eslint-config-next`, `@types/node`, `@types/react`, `@types/react-dom`.

No CMS, database, ORM, email provider, form library, or state-management
library is installed. `react-hook-form` and `zod` are explicitly deferred
to a later phase.

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
  page.tsx
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
data/
  site-config.ts
lib/
  utils.ts
docs/
  PROJECT_STATE.md
public/                (empty — assets added as needed in future phases)
```

Directories in the target architecture that do not yet exist
(`components/hero/`, `components/projects/`, `components/engagement/`,
`components/terminal/`, `components/contact/`, `components/sections/`,
`hooks/`, `types/`, `data/projects.ts`, `lib/projects.ts`,
`lib/quote-estimator.ts`) are intentionally deferred — they belong to
features scoped for later phases and were not stubbed out empty.

## Routes

| Route              | Status                                  |
| ------------------ | ---------------------------------------- |
| `/`                | Minimal placeholder (name, role, CTAs)  |
| `/about`           | Minimal placeholder                      |
| `/projects`        | Minimal placeholder                      |
| `/projects/[slug]` | Minimal placeholder, dynamic param wired |
| `/services`        | Minimal placeholder                      |
| `/contact`         | Minimal placeholder, mailto link only    |
| `not-found`        | Implemented, styled                      |

None of these routes contain final content. They exist to validate the
route structure and design system, and are ready for real content in
future phases.

## Implemented Components

- `components/ui/neo-button.tsx` — `NeoButton` + `neoButtonClasses` helper
  (primary, secondary, ghost variants; hard shadow, pressed state, focus
  ring). The class helper exists so link-based CTAs can share the same
  visual style without nesting an anchor inside a `<button>`.
- `components/ui/neo-card.tsx` — `NeoCard` generic surface wrapper.
- `components/ui/retro-window.tsx` — `RetroWindow` title-bar container with
  decorative (aria-hidden) window controls.
- `components/ui/tech-badge.tsx` — `TechBadge` sticker-style label, 5 color
  variants mapped to the palette.
- `components/ui/toggle.tsx` — `Toggle` accessible controlled switch
  (`role="switch"`), built for future CRT/cursor/sound toggles.
- `components/ui/modal.tsx` — `Modal` accessible dialog: portal-rendered,
  Escape-to-close, overlay-click-to-close, focus trap + focus restore.
- `components/layout/navbar.tsx` — sticky header, active-route highlighting,
  mobile menu (client component).
- `components/layout/footer.tsx` — minimal footer with email + identity.

## Completed Features

- Next.js + TypeScript + Tailwind CSS v4 project initialized in the
  repository root (no nested project folder).
- Dark, retro-desktop-based semantic color token system defined once in
  `app/globals.css` (`background`, `foreground`, `surface`, `border`,
  `accent`, `accent-secondary`, `muted`, `focus`) plus the raw brand
  palette, all registered as Tailwind utilities via `@theme`.
- Typography: Space Grotesk for headings/body, VT323 reserved for
  system/retro labels only — never body copy.
- Global style foundation: selection styling, visible keyboard focus
  (`:focus-visible`), responsive `container-app` utility, opt-in `bg-grid`
  and `scanlines` utilities (neither applied globally), neo-brutalist
  border/shadow utilities, `prefers-reduced-motion` support.
- Six reusable UI primitives (above), all typed, all accessible.
- Site-wide layout shell (Navbar + Footer) wired into the root layout.
- Route foundation for all six required routes plus `not-found`.
- Centralized typed site configuration (`data/site-config.ts`) with real
  identity data and an intentionally empty `socials` array.

## Architecture Decisions

- **Dark theme as the single base theme**, not a light/dark toggle. The
  approved palette (CRT green, cyber yellow, hot pink, etc.) is designed to
  pop against a dark surface; a toggle was not requested and would add
  scope beyond Phase 1.
- **No `clsx`/`tailwind-merge`.** A minimal local `cn()` in `lib/utils.ts`
  covers the current need (joining conditional class strings) without
  adding dependencies not on the approved list.
- **`neoButtonClasses` extracted from `NeoButton`.** Needed so `next/link`
  CTAs can render with identical button styling without invalid
  `<a>`-inside-`<button>` HTML nesting.
- **Server components by default.** `NeoCard`, `RetroWindow`, `TechBadge`,
  and `Footer` have no interactivity and ship no client JS. `Navbar`,
  `Toggle`, and `Modal` are `"use client"` because they hold state or use
  browser-only APIs (portal, focus management).
- **Scaffolding workaround:** `create-next-app` refuses to run in a
  directory whose name contains uppercase letters (`PersonalPortfolio`).
  The app was scaffolded into a temporary lowercase-named subfolder, then
  its contents were moved into the repository root and the temp folder
  removed. No nested project directory or second Git repository was
  created.
- **`AGENTS.md` / `CLAUDE.md` at the repo root** are auto-generated by
  Next.js 16 itself (`next dev`/`next build` regenerate the
  `nextjs-agent-rules` block) and are committed as framework output, not
  authored project documentation.

## Known Issues

- No automated tests exist yet (none were in scope for Phase 1).
- `public/` is currently empty; default `create-next-app` sample SVGs were
  removed as unused. Real image assets will be added when the sections
  that need them are built.
- Favicon is still the default `create-next-app` icon; replacing it was
  out of scope for this phase.
- All page content is placeholder text, by design — not a defect.

## Next Planned Phase

Phase 2 — Core Homepage

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
- Respect `prefers-reduced-motion` in any new Framer Motion usage.
- Update this file and `README.md` at the end of every phase so they stay
  accurate — do not let them describe unimplemented features as done.
