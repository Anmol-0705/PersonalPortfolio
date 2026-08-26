# Project State

This document is the authoritative handoff record for AI coordination
across development phases. Update it whenever a phase completes.

## Current Phase

Phase 5 — Contact Delivery Integration and Retro Interaction Controls

## Phase Status

Complete

## Last Updated

2026-08-26

## Current Branch

main

## Latest Commit

`feat: add contact delivery and retro controls` (this commit — see
`git log` for the hash)

## Build Status

PASS — `npm run build` completes successfully. `/api/contact` compiles as
a dynamic server route; all other routes unchanged from Phase 4.

## Lint Status

PASS — `npm run lint` reports no errors or warnings. Note: the
`react-hooks/set-state-in-effect` rule (new in this toolchain) rejected
the first draft of `useLocalStorage` (a plain `useEffect` + `setState`
read) — rewritten with `useSyncExternalStore` instead; see Architecture
Decisions.

## Tech Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript 5
- Tailwind CSS v4
- Framer Motion — unchanged from Phase 4
- Lucide React — added `MonitorCog` (retro settings trigger)
- **Resend 6.22.1** (new) — server-only transactional email
- `next/font/google`: Space Grotesk, VT323 (unchanged)
- Web Audio API (browser built-in, no package) — retro sound effects

## Dependencies

Production: `next`, `react`, `react-dom`, `framer-motion`, `lucide-react`,
**`resend`** (new).

Dev: unchanged from Phase 4.

Explicitly not installed, per instructions: a database/ORM/CMS package,
Redux, React Hook Form, Zod (manual validation was sufficient — see
`app/api/contact/route.ts`), a CAPTCHA service, analytics.

## Environment Variables

| Variable            | Required | Purpose                                         |
| -------------------- | -------- | ------------------------------------------------ |
| `RESEND_API_KEY`    | Yes      | Resend API key for sending mail                  |
| `RESEND_FROM_EMAIL` | Yes      | Verified sender address                          |
| `CONTACT_TO_EMAIL`  | No       | Delivery inbox; falls back to `siteConfig.email` |

`.env.example` documents these with placeholder values only.
`.gitignore` already ignored `.env*`; added `!.env.example` so the
example file itself can be committed while `.env.local` stays ignored
(verified with `git check-ignore -v`). No real key was ever written to
any file in this repository.

## Current Directory Structure

```
app/
  api/
    contact/route.ts        (new) POST handler: validate → spam-check → Resend
  about/, contact/, projects/, services/   (unchanged from Phase 4)
  layout.tsx                 (wraps body in RetroPreferencesProvider,
                               mounts CursorTrail + RetroControls once)
  globals.css                 (new: global CRT overlay rule)
components/
  layout/            navbar.tsx, footer.tsx (unchanged)
  ui/                modal.tsx (fixed: useId() for aria-labelledby,
                     plays a click sound on open), others unchanged
  hero/, sections/, projects/, engagement/   (unchanged from Phase 4)
  contact/           contact-form.tsx (rewritten: real fetch to
                     /api/contact, honeypot field, resubmit cooldown),
                     quick-quote-modal.tsx (unchanged)
  retro/             (new)
    retro-preferences-provider.tsx   shared context: crt/trail/sound state
                                      + lazy Web Audio playClick/playToggle
    retro-controls.tsx                floating settings button + panel
    cursor-trail.tsx                   rAF-driven trailing dots, no React
                                        re-renders per mousemove
data/
  services.ts, site-config.ts, projects.ts   (unchanged)
lib/
  contact-email.ts    (new) server-only: builds HTML/text email, calls Resend
  quote-estimator.ts, projects.ts, utils.ts   (unchanged)
hooks/
  use-local-storage.ts  (new) SSR-safe, useSyncExternalStore-based
  use-crt-mode.ts        (new) thin context-consumer wrapper
  use-cursor-trail.ts    (new) thin context-consumer wrapper
  use-sound.ts            (new) thin context-consumer wrapper
types/
  contact.ts    (new) ContactRequestPayload, ContactApiResponse
  quote.ts, project.ts   (unchanged)
docs/
  PROJECT_STATE.md
.env.example    (new)
public/            (empty — unchanged)
```

Not created: `components/retro/crt-overlay.tsx` — see Architecture
Decisions for why the CRT effect is a global CSS rule instead of a
component.

## Routes

| Route              | Status                                                        |
| ------------------- | ---------------------------------------------------------------- |
| `/`                | Unchanged homepage; engagement flow now delivers real email      |
| `/about`           | Minimal placeholder (unchanged)                                  |
| `/projects`        | Unchanged                                                         |
| `/projects/[slug]` | Unchanged                                                         |
| `/services`        | Unchanged                                                         |
| `/contact`         | Unchanged UI; `ContactForm` now calls the real API                |
| `not-found`        | Unchanged                                                         |

## API Routes

- **`POST /api/contact`** — accepts `ContactRequestPayload` JSON.
  Rate-limits by IP (one request per 15s, in-memory), rejects honeypot
  hits and malformed payloads with `400`, sends via
  `lib/contact-email.ts`, and returns `{ success: true }` or
  `{ success: false, error: <safe message> }`. Missing
  `RESEND_API_KEY`/`RESEND_FROM_EMAIL` returns `500`; a Resend-side send
  failure returns `502`. Never echoes back internals, stack traces, or
  env values.

## Implemented Components (new in Phase 5)

- `components/retro/retro-preferences-provider.tsx` — `RetroPreferencesProvider`
  / `useRetroPreferences`. One context provider backing all three retro
  preferences plus lazily-initialized Web Audio playback, mounted once in
  `app/layout.tsx`.
- `components/retro/retro-controls.tsx` — `RetroControls`. Fixed
  bottom-right settings button (`aria-expanded`/`aria-haspopup`) that
  opens a small "DISPLAY / FX" panel with three `Toggle`s (reused from
  Phase 1), closing on outside-click or Escape.
- `components/retro/cursor-trail.tsx` — `CursorTrail`. Renders `null`
  unless enabled; when active, checks `prefers-reduced-motion` and
  `(pointer: fine)` once before attaching a `pointermove` listener and a
  `requestAnimationFrame` loop that writes trail-dot positions directly
  via `element.style.transform` (no per-frame React state).
- `lib/contact-email.ts` — server-only. Builds an HTML email (inline
  styles, escaped user input) with a plain-text fallback, sets
  `replyTo` to the visitor's validated email, and calls
  `resend.emails.send()`. Subject line varies by request type (plain
  contact vs. Quick Sprint vs. Full Build).
- `app/api/contact/route.ts` — the POST handler described above.

## Contact Delivery Architecture

```
ContactForm (client)
  → client-side required-field + email-format validation
  → fetch POST /api/contact
      → server-side validation (name/email/message shape + length, honeypot)
      → per-IP rate limit
      → lib/contact-email.ts: format HTML/text email, call Resend
  → JSON { success: true } | { success: false, error }
  → ContactForm shows success or error UI accordingly
```

`RESEND_API_KEY`/`RESEND_FROM_EMAIL`/Resend SDK usage is confined to
`lib/contact-email.ts`, imported only by `app/api/contact/route.ts` — a
server-only module never reachable from client bundles.

## Email Submission Flow

Both the plain contact form and the Quick Sprint/Full Build quote flow
post the same shape to `/api/contact`; the optional `quote: QuoteContext`
field is what distinguishes them. `lib/contact-email.ts` reuses
`summarizeQuickSprint`/`summarizeProject` from `lib/quote-estimator.ts`
(the same functions the UI uses) to render the engagement details as a
readable bullet list in both the HTML and plain-text email bodies — never
raw JSON. Subject line: `New Portfolio Contact Request` for plain
messages, `New Portfolio Quote Request — Quick Sprint` /
`— Full Build` otherwise.

## Retro Interaction Architecture

- **CRT**: `RetroPreferencesProvider` sets `document.documentElement.dataset.crt`
  in a `useEffect` whenever the `crt` boolean changes. A single global CSS
  rule in `app/globals.css` (`html[data-crt="true"] body::after`) paints a
  static (non-animated) scanline texture at `z-index: 9999`,
  `pointer-events: none`. No per-component overlay.
- **Cursor trail**: see `CursorTrail` above. Only mounts its
  `pointermove`/rAF loop when enabled, pointer is fine, and reduced
  motion is not requested.
- **Sound**: Web Audio `AudioContext` created lazily inside
  `RetroPreferencesProvider`, only on the first `playClick`/`playToggle`
  call — never on mount, never before a user gesture. Currently wired to
  two triggers: the retro toggle switches themselves (`playToggle`) and
  `Modal` opening (`playClick`). Deliberately **not** wired to every
  `NeoButton` click site-wide — the brief warns against "annoying audio
  behavior," and dozens of buttons playing a sound on every click would
  cross that line.

## User Preference Persistence

All three preferences (`retro-crt-enabled`, `retro-trail-enabled`,
`retro-sound-enabled`) persist via `hooks/use-local-storage.ts`, built on
`useSyncExternalStore` rather than a `useEffect` + `setState` read (see
Architecture Decisions). Defaults are `false` for all three, matching the
spec. Verified via Playwright: toggling each control updates
`localStorage` immediately, and a full page reload restores the same
state (including the CRT `data-crt` attribute).

## Accessibility Decisions

- **Modal fix**: `Modal` now calls `useId()` once per instance and uses
  that value for both `aria-labelledby` on the dialog and `id` on the
  `<h2>` title, replacing the old hardcoded `"modal-title"`. Verified via
  Playwright that the generated id is unique (not the old literal string)
  and that it correctly resolves to the title text. Escape-to-close,
  overlay-click-to-close, focus trap + restore, and the Phase 4
  mobile-scroll fix were all re-verified working after this change.
- Retro controls: real `<button>`s throughout (no clickable divs),
  `aria-expanded`/`aria-haspopup`/`aria-controls` on the trigger, visible
  focus rings inherited from the design system, closes on Escape and
  outside click.
- `CursorTrail`'s root is `aria-hidden="true"` — it is purely decorative
  and contributes nothing to the accessibility tree.
- **Reduced motion takes priority over the decorative toggle.** Even with
  the cursor-trail preference enabled, the effect never initializes when
  `prefers-reduced-motion: reduce` is set — verified via Playwright with
  `reducedMotion: "reduce"` context (trail dots never received a
  transform). CRT mode has no animation to gate (static scanlines only).
  Framer Motion usage elsewhere (`RetroHero`, `EngagementSelector`) is
  unchanged from Phase 2/4 and continues to respect
  `MotionConfig reducedMotion="user"`.

## Architecture Decisions

- **One shared `RetroPreferencesProvider`, not three independent
  `useLocalStorage` hooks.** The settings panel, `Modal` (sound), and
  `CursorTrail` all need to read (and in one case write) the same
  booleans from different parts of the tree. Three independent
  localStorage subscriptions could desync within a tab; one context
  keeps them trivially in sync. `hooks/use-crt-mode.ts`,
  `use-cursor-trail.ts`, and `use-sound.ts` still exist exactly as named
  in the target architecture — they're just thin consumers of the shared
  context rather than each independently touching `localStorage`.
- **`useLocalStorage` rewritten around `useSyncExternalStore`, not
  `useEffect` + `setState`.** The obvious "read localStorage in an
  effect, then `setState`" implementation is rejected by this project's
  current lint config (`react-hooks/set-state-in-effect`, treated as an
  error). `useSyncExternalStore` is the React-provided API for exactly
  this case — an external store whose value can legitimately differ
  between server and client — and avoids both the lint error and any
  hydration mismatch, since React defers to the server snapshot through
  hydration and only switches to the live value afterward.
- **No `components/retro/crt-overlay.tsx`.** The brief explicitly
  preferred "one global implementation" over per-component overlays; a
  component would just render a div that does the same thing the CSS
  rule already does more simply, so it was left out.
- **No dedicated rate-limit or validation library.** A 15-second
  in-memory per-IP `Map` and a handful of manual `typeof`/length checks
  were enough; a real dependency would be overkill for "lightweight spam
  protection" on a single route.
- **Sound scoped to two triggers, not global button clicks.** See Retro
  Interaction Architecture above.
- **`Modal` now depends on `useSound`, i.e. on being rendered inside
  `RetroPreferencesProvider`.** True everywhere in this app (the provider
  wraps the whole `<body>`), but worth knowing if `Modal` is ever reused
  outside that tree in the future.

## Known Issues

- **Live email delivery was not tested** — no `RESEND_API_KEY` is
  configured in this environment. The missing-configuration path was
  verified (honest `500` response, no fake success), but no email has
  actually been sent by this implementation. See Live Email Delivery
  Test Status below.
- The in-memory rate limiter resets on server restart and isn't shared
  across serverless instances — a deliberate "lightweight guard" per the
  brief, not a production-grade spam defense.
- `CursorTrail`'s pointer/reduced-motion check runs once when the effect
  starts (on enable), not on a live media-query listener — plugging in a
  mouse on a touch device won't retroactively enable the trail without
  re-toggling it.
- No automated tests exist yet (out of scope).
- Favicon is still the Next.js default.

## Live Email Delivery Test Status

**NOT TESTED.** No real `RESEND_API_KEY` was available in this
environment, and none was requested or invented. What *was* verified:

- With no key configured, `POST /api/contact` returns `500` with a safe,
  generic error message (never a fake success).
- `ContactForm` correctly shows its error state with the returned message
  and a working `mailto:` fallback — never a false "sent" message.
- Server-side console logging confirms the missing-config path is hit and
  logs a clear diagnostic without printing any secret values.

When a real key is available, set it in `.env.local` (not `.env.example`)
and submit the form once to confirm live delivery before relying on it in
production.

## Next Planned Phase

Phase 6 — Interactive Terminal and Command Experience

(Not started. Do not begin without explicit instruction.)

## Rules for Future Development

- Do not create a nested `PersonalPortfolio` directory or a second Git
  repository.
- Never commit `.env.local` or any real credential. `.env.example` stays
  placeholder-only.
- Do not claim email delivery succeeded unless the Resend API call
  actually returned success — `ContactForm`'s success state must stay
  gated on the API response, never optimistic.
- Keep `RESEND_API_KEY` and all Resend SDK usage inside
  `lib/contact-email.ts`, imported only from server code
  (`app/api/contact/route.ts`). Never import it from a `"use client"` file.
- Keep retro preference state flowing through
  `RetroPreferencesProvider`/`useRetroPreferences` — don't add a second,
  independent `useLocalStorage` call for the same preference elsewhere.
- Any new `useLocalStorage`-backed value should follow the
  `useSyncExternalStore` pattern already in place, not a
  `useEffect`+`setState` read (the lint rule will reject it).
- Keep sound effects sparse and intentional — do not wire `playClick`/
  `playToggle` into every interactive element.
- Reduced-motion must always win over a decorative toggle; never gate
  that check behind the user's own preference.
- Keep estimation logic and label maps in `lib/quote-estimator.ts`;
  project/service content in `data/projects.ts`/`data/services.ts`.
- Before adding a `lucide-react` icon import, confirm the export exists
  in the installed version.
- Before committing any Markdown file, verify its encoding with
  `file <path>`.
- Update this file and `README.md` at the end of every phase so they stay
  accurate — do not let them describe unimplemented or untested features
  as done.
