# Project State

This document is the authoritative handoff record for AI coordination
across development phases. Update it whenever a phase completes.

## Current Phase

Phase 6 — Interactive Terminal and Command Experience

## Phase Status

Complete

## Last Updated

2026-08-26

## Current Branch

main

## Latest Commit

`feat: add interactive portfolio terminal` (this commit — see `git log`
for the hash)

## Build Status

PASS — `npm run build` completes successfully. All routes unchanged in
count/shape from Phase 5; no new routes were added (the terminal is
modal-based, not a route).

## Lint Status

PASS — `npm run lint` reports no errors or warnings.

## TypeScript Status

PASS — `npm run build`'s TypeScript pass completes with no errors.

## Tech Stack

Unchanged from Phase 5: Next.js 16 (App Router, Turbopack), React 19,
TypeScript 5, Tailwind CSS v4, Framer Motion, Lucide React, Resend,
`next/font/google` (Space Grotesk, VT323). The terminal is built entirely
with plain React state and the existing `Modal`/design system — no new
library.

## Dependencies

**None added.** Same dependency set as Phase 5.

## Phase 5 Update — Live Email Delivery

**Live Email Delivery: TESTED AND WORKING.** The user manually configured
a real `RESEND_API_KEY` in their local `.env.local` and confirmed real
emails were delivered. This session did not view, modify, or commit
`.env.local`, and did not request or handle the key — the confirmation
is recorded here on the user's report alone, per their explicit
instruction. The Phase 5 "NOT TESTED" status in this file is now
superseded by this entry.

## Current Directory Structure

```
app/
  api/contact/route.ts        (unchanged)
  about/, contact/, projects/, services/, layout.tsx, globals.css   (unchanged)
  page.tsx                     (adds <TerminalSection /> before the final CTA)
components/
  layout/, ui/, hero/, projects/, engagement/, contact/, retro/   (unchanged)
  sections/
    terminal-section.tsx        (new) homepage teaser + Modal + <Terminal />
    (others unchanged)
  terminal/                     (new)
    terminal.tsx                  command input/output UI, history, keyboard nav
    terminal-commands.ts           data-driven command registry + dispatcher
data/
  skills.ts       (new — extracted from skills-section.tsx, see below)
  services.ts, site-config.ts, projects.ts   (unchanged)
lib/
  projects.ts, quote-estimator.ts, utils.ts, contact-email.ts   (unchanged)
hooks/            (unchanged)
types/            (unchanged)
docs/
  PROJECT_STATE.md
```

## Routes

Unchanged from Phase 5 (`/`, `/about`, `/projects`, `/projects/[slug]`,
`/services`, `/contact`, `/api/contact`, `not-found`). The terminal is
reached from `/` via a button that opens a `Modal` — it is not a route,
and commands that "navigate" use `next/navigation`'s router against the
existing routes above. No new route was created or invented.

## Implemented Components

- **`components/terminal/terminal-commands.ts`** — a typed,
  data-driven command registry. Each `TerminalCommand` has `name`,
  `aliases`, `description`, an optional `hidden` flag, and a pure
  `run(args)` function returning one of three actions: `print` (append
  output lines), `clear` (reset the transcript), or `navigate` (push a
  route, optionally printing a line first). `runTerminalCommand(input)`
  parses the raw input, looks up the command (case-insensitive, alias
  -aware), and dispatches — or returns a friendly "not recognized"
  result. No command logic lives inside the React component.
- **`components/terminal/terminal.tsx`** — the interactive UI: a
  `role="log"` output transcript (`aria-live="polite"`), a labelled text
  input, ArrowUp/ArrowDown command history, auto-scroll to the latest
  output, and auto-focus of the input on mount (see Architecture
  Decisions for why that needs its own effect). Output lines with an
  `href` render as a real `next/link` (internal paths) or `<a>`
  (`mailto:` etc.), so project results are directly clickable/keyboard
  -selectable, not just printed text.
- **`components/sections/terminal-section.tsx`** — the homepage
  placement: a compact "Prefer the command line?" teaser between
  Engagement and the final CTA, an "Open Terminal" button, and the
  `Modal` (title `terminal.exe`) that hosts `<Terminal />`.

## Supported Commands

| Command | Aliases | Behavior |
| --- | --- | --- |
| `help` | — | Lists all non-hidden commands with descriptions |
| `about` | `whoami` | Name, role, experience, projects delivered, location, availability (from `siteConfig`) |
| `skills` | — | Grouped tech stack (from `data/skills.ts`) |
| `projects` | — | Numbered, clickable list of all projects (from `lib/projects.ts`) |
| `projects <slug>` | — | Navigates to `/projects/<slug>` if the slug exists; friendly error otherwise |
| `services` | `work` | Service labels/titles (from `data/services.ts`) + link to `/services` |
| `hire` | — | Quick Sprint (₹2000/5hr) and Full Build (custom quote) summary + link to `/#engagement` |
| `contact` | `email` | Email (mailto link), location, availability (from `siteConfig`) + link to `/contact` |
| `home` | — | Navigates to `/` |
| `theme` | — | Points to the existing CRT/trail/sound controls — no duplicate UI |
| `date` | — | Current local date/time (client-side `Date`) |
| `clear` | `cls` | Clears the transcript, keeps the input row |
| `sudo hire` | — | Hidden easter egg — playful redirect to `hire`, omitted from `help` |
| *(anything else)* | — | `Command not recognized: "<input>"` + hint to type `help` |

## Command Aliases

`whoami → about`, `work → services`, `email → contact`, `cls → clear`.
Exactly the four suggested in the brief — no additional aliases were
added.

## Navigation Behavior

`projects <slug>`, `home`, and the clickable links produced by `projects`
navigate via `next/navigation`'s `useRouter().push()` (for command-
triggered navigation) or a real `next/link` (for clicked output lines) —
both go through Next's existing App Router against real, already-built
routes. `hire`'s and `services`' output links point at `/#engagement` and
`/services` respectively; `contact`'s email line is a genuine `mailto:`
link. No route or URL was invented.

## Accessibility Decisions

- Output transcript uses `role="log"` with `aria-live="polite"` and
  `aria-relevant="additions"` — a real, correctly-applicable ARIA role
  for a sequentially-appended message list (not a misapplied "terminal"
  role).
- The command input has a visually-hidden `<label>` ("Terminal command
  input") plus a visible `>` prompt glyph (`aria-hidden`), and the same
  focus-visible outline treatment used everywhere else in the design
  system.
- Project/service/contact links inside the output are real focusable
  `<a>`/`next/link` elements — reachable and activatable by keyboard, not
  just mouse.
- **Modal focus fix**: the shared `Modal` focuses its own first focusable
  element on open, which is its close (×) button — that's existing,
  correct behavior for `Modal` in general, but the brief specifically
  requires the terminal *input* to receive focus on open. `Terminal` adds
  its own mount effect that defers to the next animation frame before
  focusing the input, so it runs after `Modal`'s synchronous focus call
  and wins. Verified via Playwright: the focused element id immediately
  after open is `terminal-input`, not the close button.
- Escape-to-close, overlay-click-to-close, focus trap, and focus-restore
  to the "Open Terminal" trigger are all inherited from `Modal` and were
  re-verified working with the terminal as content.
- No animation loops, no glitch effects, nothing gated behind
  `prefers-reduced-motion` because nothing in the terminal moves —
  satisfies "respect reduced motion" trivially by not needing to.

## Responsive Behavior

Tested at 375px, 768px, and 1440px via Playwright screenshots:

- **375px**: output wraps correctly (multi-line project entries stay
  readable, no horizontal scroll), input remains full-width and usable,
  window chrome (inherited from `Modal`) scales down cleanly.
- **768px**: output area comfortably fits the 5-project list without
  excessive scrolling; layout matches the desktop pattern at a smaller
  scale.
- **1440px**: full desktop layout, `max-w-2xl` modal width (widened from
  `Modal`'s default `max-w-lg` via its `className` prop specifically for
  the terminal's denser text content).

## Completed Features

- Data-driven terminal command system reusing `lib/projects.ts`,
  `data/services.ts`, `data/site-config.ts`, and the newly-extracted
  `data/skills.ts` — zero duplicated portfolio content.
- Command history (ArrowUp/ArrowDown), friendly unknown-command handling,
  `clear`, aliases, a hidden easter egg, and clickable navigation —
  all verified via Playwright end to end.
- Homepage placement that is discoverable but non-intrusive: a small
  teaser section, no auto-open, no disruption to existing sections or
  CTAs.
- Live Resend email delivery confirmed working (Phase 5 status updated
  above).

## Architecture Decisions

- **`data/skills.ts` extracted from `skills-section.tsx`.** The terminal's
  `skills` command needed the same grouped list `SkillsSection` already
  defined locally; extracting it (same pattern as Phase 4's
  `data/services.ts`) avoided a second copy, per the brief's explicit
  "must not become a second copy of portfolio data" instruction.
- **Commands are plain data + pure functions, not React.** `TerminalCommand.run()`
  takes only `args: string[]` and returns a serializable result — no
  React imports, no router coupling — so the command table stays easy to
  read/extend and is trivially unit-testable if tests are added later.
  `Terminal.tsx` is the only place that touches `useRouter()`, React
  state, or the DOM.
- **`clear`/`navigate` modeled as result variants, not special-cased in
  the component.** A discriminated `TerminalCommandResult` (`print` |
  `clear` | `navigate`) keeps `Terminal.tsx`'s dispatch logic a single
  small `if/else` rather than hardcoding "if command name is clear, do X."
- **Terminal reuses `Modal` rather than a bespoke window.** Escape,
  overlay-click, focus trap, and the Phase 4 mobile-scroll fix all come
  for free; the only addition needed was the input-focus effect described
  above.
- **Placed as a homepage teaser + modal, not a persistent floating
  widget.** Keeps it discoverable without adding a permanently-visible
  UI element competing with the retro settings control already in that
  corner.
- **No terminal "route."** Commands that navigate go through the real
  App Router against existing pages; the terminal itself never becomes
  a URL-addressable surface, keeping it clearly a secondary, optional
  experience rather than primary navigation.

## Known Issues

- Command matching is case-insensitive but exact-token only — no fuzzy
  matching or partial-command suggestions (e.g., "hlp" does not suggest
  "help"). Consistent with "friendly unknown-command message," not a
  full shell.
- The terminal's `role="log"` region and the `Modal`'s own
  `overflow-y-auto` are nested scroll containers; this works correctly in
  testing but is worth a manual check if the Modal's own sizing changes
  in a future phase.
- No automated tests exist yet (out of scope).
- Favicon is still the Next.js default.

## Next Planned Phase

No specific next phase was assigned by this instruction set (unlike
Phases 1–5, which each named the following phase explicitly). Candidates
worth considering, not started: a lightweight boot/loading sequence,
further homepage content/SEO polish, or automated test coverage. Do not
begin any of these without explicit instruction.

## Rules for Future Development

- Do not create a nested `PersonalPortfolio` directory or a second Git
  repository.
- Never commit `.env.local` or any real credential.
- Terminal command content must keep reading from existing data sources
  (`lib/projects.ts`, `data/services.ts`, `data/skills.ts`,
  `data/site-config.ts`) — never hardcode a second copy of portfolio
  facts inside `terminal-commands.ts`.
- New terminal commands should return a `TerminalCommandResult` from a
  pure `run()` function — keep React/router concerns inside
  `terminal.tsx`, not the command table.
- If `Modal` is ever reused for content whose first focusable element
  should receive initial focus (as the terminal needed), follow the
  same "defer to next frame" pattern rather than modifying `Modal`'s
  generic focus behavior, which other modals may depend on as-is.
- Keep retro preference state flowing through
  `RetroPreferencesProvider`/`useRetroPreferences`.
- Keep `RESEND_API_KEY` and Resend SDK usage inside
  `lib/contact-email.ts`, server-only.
- Before adding a `lucide-react` icon import, confirm the export exists
  in the installed version.
- Before committing any Markdown file, verify its encoding with
  `file <path>`.
- Update this file and `README.md` at the end of every phase so they stay
  accurate — do not let them describe unimplemented or untested features
  as done.
