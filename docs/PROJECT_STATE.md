# Project State

This document is the authoritative handoff record for AI coordination
across development phases. Update it whenever a phase completes.

## Current Phase

Phase 4 — Engagement Selector and Conversion Flow

## Phase Status

Complete

## Last Updated

2026-08-26

## Current Branch

main

## Latest Commit

`feat: add engagement selector and quote flow` (this commit — see
`git log` for the hash)

## Build Status

PASS — `npm run build` completes successfully. All routes compile,
including the 5 statically generated `/projects/[slug]` pages.

## Lint Status

PASS — `npm run lint` reports no errors or warnings.

## Tech Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript 5
- Tailwind CSS v4
- Framer Motion — `RetroHero` (unchanged) and `EngagementSelector` (new:
  subtle panel crossfade between Quick Sprint / Full Build, wrapped in
  `MotionConfig reducedMotion="user"`)
- Lucide React — added `Check` (`OptionChip`), `X` already in use (`Modal`)
- `next/font/google`: Space Grotesk, VT323 (unchanged)

## Dependencies

Production: `next`, `react`, `react-dom`, `framer-motion`, `lucide-react`.

Dev: `typescript`, `tailwindcss`, `@tailwindcss/postcss`, `eslint`,
`eslint-config-next`, `@types/node`, `@types/react`, `@types/react-dom`.

**No new dependencies were added in Phase 4.** Explicitly not installed,
per instructions: React Hook Form, Zod, Redux, Resend, any email/CMS/
database package, analytics.

## Current Directory Structure

```
app/
  about/page.tsx
  contact/page.tsx           (now a real page: intro + ContactForm)
  projects/                  (unchanged from Phase 3)
  services/page.tsx           (now a real page: services grid + CTAs)
  layout.tsx
  page.tsx
  globals.css
  not-found.tsx
components/
  layout/            navbar.tsx, footer.tsx
  ui/                neo-button.tsx, neo-card.tsx, retro-window.tsx,
                     tech-badge.tsx, toggle.tsx, modal.tsx (fixed: now
                     max-height + overflow-y-auto so long content scrolls
                     inside the dialog instead of overflowing the viewport)
  hero/              retro-hero.tsx
  sections/          section-heading.tsx, about-section.tsx,
                     services-section.tsx (now reads data/services.ts),
                     skills-section.tsx, projects-section.tsx,
                     engagement-section.tsx (now a client component that
                     reveals EngagementSelector on CTA click),
                     cta-section.tsx
  projects/          project-card.tsx, project-grid.tsx, project-media.tsx,
                     project-case-study.tsx
  engagement/        engagement-selector.tsx, quick-sprint-calculator.tsx,
                     project-estimator.tsx, option-chip.tsx (new shared
                     primitive, not in the original file list — see
                     Architecture Decisions)
  contact/           quick-quote-modal.tsx, contact-form.tsx
data/
  site-config.ts, projects.ts, services.ts (new: extracted from
  services-section.tsx so the homepage section and /services page share
  one source instead of duplicating copy)
lib/
  utils.ts, projects.ts, quote-estimator.ts (new: estimation logic +
  shared label maps + summary helpers for the engagement flow)
types/
  project.ts, quote.ts (new: EngagementType, QuickSprintRequest,
  ProjectRequest, QuoteEstimate, QuoteContext, and their supporting
  option types)
docs/
  PROJECT_STATE.md
public/                (empty — unchanged)
```

Still deferred: `components/terminal/`, `hooks/` (CRT/cursor/sound
toggles), a real `data/projects.ts` media path, and any backend/API
route — all scoped to Phase 5+.

## Routes

| Route              | Status                                                    |
| ------------------ | ------------------------------------------------------------ |
| `/`                | Full homepage; Engagement section now interactive (`id="engagement"`) |
| `/about`           | Minimal placeholder (unchanged)                              |
| `/projects`        | Full listing (unchanged from Phase 3)                        |
| `/projects/[slug]` | Full case study (unchanged from Phase 3)                     |
| `/services`        | **New: real page** — services grid + CTAs into `/#engagement` and `/contact` |
| `/contact`         | **New: real page** — intro, mailto, `ContactForm`             |
| `not-found`        | Implemented, styled (unchanged)                               |

## Implemented Components (new in Phase 4)

- `components/engagement/option-chip.tsx` — shared radio/checkbox "chip"
  control: a real `<input type="radio"|"checkbox">` visually hidden with
  `sr-only` inside a `<label>`, with a styled sibling `<span>` reflecting
  checked state via JS (icon + border + color change — never color alone).
  Used by both the sprint calculator and the project estimator across 6
  different fields, which is why it was extracted as its own file.
- `components/engagement/quick-sprint-calculator.tsx` —
  `QuickSprintCalculator`. Work-type + scope selection (both via
  `OptionChip`), optional task description, a live honest estimate panel
  (`aria-live="polite"`), and a "Discuss This Sprint" button that builds a
  `QuoteContext` and hands it to the parent.
- `components/engagement/project-estimator.tsx` — `ProjectEstimator`.
  Project type, complexity (with description text), timeline, and
  multi-select requirements (all via `OptionChip`), a live scope/level
  estimate, and a "Request a Custom Quote" button.
- `components/engagement/engagement-selector.tsx` — `EngagementSelector`.
  Accessible ARIA tabs (`role="tablist"`/`"tab"`/`"tabpanel"`, roving
  `tabIndex`, arrow-key navigation with focus movement) switching between
  the two flows; owns the `QuoteContext` state and renders
  `QuickQuoteModal`.
- `components/contact/quick-quote-modal.tsx` — `QuickQuoteModal`. Wraps
  the Phase 1 `Modal`; shows a read-only summary of the user's selections
  (via `summarizeQuickSprint`/`summarizeProject`) above a `ContactForm`
  that receives the full `QuoteContext`.
- `components/contact/contact-form.tsx` — `ContactForm`. Native
  controlled form (Name, Email, Company (optional), Message), inline
  validation (required fields + email regex), submitting/success/error
  states, and a documented placeholder `submitContactRequest()` — see
  Submission Status below.

## Completed Features

- Full Quick Sprint and Full Build conversion flows, homepage-embedded
  (see Engagement Flow below).
- Deterministic, transparent estimation logic in `lib/quote-estimator.ts`
  — no fabricated exact pricing; the sprint's "indicative estimate" is
  always explicitly labelled and tied back to the ₹2000 / 5-hour package;
  the project estimator returns a qualitative engagement level, never a
  number.
- User selections carry forward into the quote modal without re-entry.
- `/services` and `/contact` are real pages now, both server components
  except for the client `ContactForm`.
- Accessibility: real `button`/`input`/`textarea`/`fieldset`/`legend`
  elements throughout (no clickable divs), labelled controls, `aria-live`
  estimate panels, accessible tabs with keyboard support, Escape-to-close
  and overlay-click-to-close modal (inherited from Phase 1, verified),
  focus trap + focus restore (inherited, verified), reduced-motion
  respected via `MotionConfig`.
- Performance: only components that need interactivity are client
  components (`EngagementSection`, `EngagementSelector`,
  `QuickSprintCalculator`, `ProjectEstimator`, `OptionChip`,
  `ContactForm`); `QuickQuoteModal`, `/services`, and `/contact` (aside
  from the form) stay server components.

## Engagement Flow

**Quick Sprint:** homepage card "Discuss a Sprint" → reveals
`EngagementSelector` (Quick Sprint tab active) → user picks a work type
and an approximate scope (5 options from "Up to 1 hour" to "Full 5-hour
sprint") and optionally describes the task → sees a live honest message
("appears suitable for a focused sprint" vs. "may require more than one
sprint") plus an explicitly-labelled indicative estimate → clicks
"Discuss This Sprint" → `QuickQuoteModal` opens with the selections shown
read-only → user fills Name/Email/(Company)/Message → submits through the
placeholder handler → sees the honest "Request ready" success state with
a direct mailto fallback.

**Full Build:** homepage card "Plan a Project" → reveals
`EngagementSelector` (Full Build tab active) → user picks a project type,
complexity (with a plain-language description per level), timeline, and
any number of requirements → sees a live qualitative estimate ("This
looks like a Focused/Standard/Advanced Build," with guidance text, never
a price) → clicks "Request a Custom Quote" → same modal/form/placeholder
flow as above.

Both flows are also reachable via `/services`' "See Engagement Options"
link, which anchors to `/#engagement`.

## Quote Data Flow

`EngagementSelector` holds `activeType` (which tab) and `quoteContext`
(`QuoteContext | null`). `QuickSprintCalculator`/`ProjectEstimator` each
hold their own local form state, derive a `QuoteEstimate` on every change
via `estimateQuickSprint`/`estimateProject` (pure functions in
`lib/quote-estimator.ts`), and on submit call `onRequestQuote(context)`
with a fully-built `QuoteContext = { engagementType, quickSprint | project,
estimate }`. That single object is passed straight into
`QuickQuoteModal`, which derives its summary lines via
`summarizeQuickSprint`/`summarizeProject` (same label maps the selection
UI uses, so summary text and option text can never drift apart) and
passes `context` through to `ContactForm`, which attaches it verbatim to
the (placeholder) submission payload. No calculation logic is duplicated
between the selection UI, the summary, and the submission payload — all
three read from the same `lib/quote-estimator.ts` functions/maps.

## Architecture Decisions

- **`OptionChip` added beyond the original file list.** Six distinct
  fields across two components needed an identical accessible
  radio/checkbox "chip" pattern; extracting it once avoided six copies of
  the same sr-only-input + styled-span logic. Consistent with the
  `SectionHeading` precedent from Phase 2.
- **Selection state lives in the calculator/estimator components, not in
  `EngagementSelector`.** Only the final `QuoteContext` needs to reach the
  parent; keeping in-progress form state local avoids unnecessary
  re-renders and keeps each component self-contained.
- **`data/services.ts` extracted from `services-section.tsx`.** The
  homepage section and the new `/services` page needed the same four
  services; duplicating the copy would have violated the "don't duplicate
  service copy" instruction.
- **`EngagementSection` became a client component.** It now needs to hold
  reveal state (`activeType`) for the interactive selector — a genuine,
  new interactivity requirement, not a redesign for its own sake.
- **No dedicated API route for contact submission.** Section 13 explicitly
  allows a clean client-side placeholder instead of unnecessary API
  infrastructure; `submitContactRequest()` in `contact-form.tsx` is that
  placeholder — documented as non-production, never used to fabricate a
  "sent" claim.
- **Modal bug found and fixed.** The Phase 1 `Modal` had no
  `max-height`/`overflow-y-auto`, so on short viewports (e.g. a phone with
  the quote form's ~9 fields worth of content) the dialog could overflow
  the viewport with no way to scroll to the submit button — exactly what
  section 20 warns against. Fixed by constraining the dialog to
  `max-h-[min(90dvh,calc(100dvh-2rem))]` with internal `overflow-y-auto`;
  verified via Playwright that the submit button becomes reachable by
  scrolling the dialog on a 375×812 viewport.
- **Playwright test-authoring note (not a product bug):** clicking an
  `OptionChip`'s underlying `sr-only` `<input>` directly (e.g. via
  `getByRole('radio', ...).click()`) fails Playwright's actionability
  check because the input's real geometry is a clipped 1×1px box — that's
  the standard sr-only-input-inside-label accessibility pattern, and real
  mouse clicks land on the visible `<span>` and bubble to the label
  exactly as expected. Verified real behavior is correct by clicking the
  `<label>` element instead; documented here so a future session doesn't
  mistake the test artifact for an app bug.

## Submission Status

- **Requests are NOT actually delivered anywhere.** No email integration,
  no external API, no database. `submitContactRequest()` in
  `components/contact/contact-form.tsx` only awaits a simulated 700ms
  delay and resolves — nothing is sent, stored, or logged.
- The UI never claims delivery. On success it shows "Request ready." plus
  "Submission delivery will be connected in the contact integration
  phase," and offers a direct `mailto:` link as the real, working
  fallback today.
- The `try`/`catch` around the call is real architecture (not
  decorative): swapping `submitContactRequest` for a real `fetch()` to a
  Phase 5 API route requires no change to `ContactForm`'s state machine.

## Documentation Updated

- **README.md**: status → Phase 4 complete; tech stack, architecture tree
  (`engagement/`, `contact/` folders), and completed-features list
  updated; explicitly states real delivery is not implemented; next steps
  → Phase 5.
- **docs/PROJECT_STATE.md**: this file — full Phase 4 rewrite covering
  the engagement flow, quote data flow, new components, submission
  status, architecture decisions (including the Modal fix and the
  Playwright test-authoring note), and next phase.

## Known Issues

- No real submission delivery yet (by design — see Submission Status).
- `Modal`'s `aria-labelledby="modal-title"` is a fixed id; fine today
  since only one `Modal` instance is ever mounted at a time, but would
  collide if that ever changes — worth revisiting if a second modal type
  is added.
- No automated tests exist yet (out of scope for Phase 4).
- Favicon is still the Next.js default.

## Next Planned Phase

Phase 5 — Contact Delivery Integration and Retro Interaction Controls

(Not started. Do not begin without explicit instruction.)

## Rules for Future Development

- Do not create a nested `PersonalPortfolio` directory or a second Git
  repository.
- Do not add `react-hook-form`, `zod`, Redux, Resend, a CMS, a database,
  or analytics until the phase that explicitly calls for them.
- Never present the engagement estimator's output as a binding price.
  Sprint estimates must stay labelled "Indicative estimate" and tied to
  the ₹2000/5-hour package; the project estimator must stay qualitative
  (Focused/Standard/Advanced Build), never a number.
- Keep estimation logic and label maps in `lib/quote-estimator.ts` —
  never re-implement scope/level logic inside a component.
- When real submission delivery is built (Phase 5), update
  `submitContactRequest()` in `contact-form.tsx` and its success-state
  copy together — don't let the UI claim delivery before it's real.
- Project content changes belong in `data/projects.ts`; service copy
  changes belong in `data/services.ts` — never duplicate either back into
  a component.
- Keep raw hex colors out of components — use the semantic tokens or
  palette tokens defined in `app/globals.css`.
- Respect `prefers-reduced-motion` in any new Framer Motion usage.
- Before adding a `lucide-react` icon import, confirm the export exists
  in the installed version.
- Before committing any Markdown file, verify its encoding with
  `file <path>` — this repo has hit a UTF-16-on-disk issue with
  README.md more than once.
- Update this file and `README.md` at the end of every phase so they stay
  accurate — do not let them describe unimplemented features as done.
