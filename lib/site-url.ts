const LOCAL_FALLBACK_URL = "http://localhost:3000";

/**
 * The site's canonical, absolute production URL, in priority order:
 *
 * 1. `NEXT_PUBLIC_SITE_URL` — an explicit override (see `.env.example`).
 *    Set this once a real custom domain is chosen; until then it can be
 *    left unset.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` — set automatically by Vercel on
 *    every deployment to the project's stable production domain (e.g.
 *    `my-portfolio.vercel.app`), without anyone hardcoding it. Not
 *    prefixed `NEXT_PUBLIC_`, so it's only readable in server code
 *    (`generateMetadata`, `app/sitemap.ts`, `app/robots.ts` — every
 *    caller of this function is server-only; see docs/PROJECT_STATE.md
 *    for the grep that confirms it) — that's fine, since Next never
 *    needs this value in a client bundle.
 * 3. `http://localhost:3000` — local dev fallback so `metadataBase`,
 *    the sitemap, and robots.txt never throw when neither is set.
 *
 * On a non-Vercel host (or before a custom domain is picked), set
 * `NEXT_PUBLIC_SITE_URL` explicitly — see "Production Configuration
 * Required" in docs/PROJECT_STATE.md.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProductionHost) {
    return `https://${vercelProductionHost}`;
  }

  return LOCAL_FALLBACK_URL;
}
