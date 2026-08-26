const LOCAL_FALLBACK_URL = "http://localhost:3000";

/**
 * The site's canonical, absolute production URL. Reads
 * `NEXT_PUBLIC_SITE_URL` (see `.env.example`); falls back to localhost
 * for local dev so `metadataBase`/sitemap/robots never throw when it's
 * unset. In production this MUST be set to the real deployed domain —
 * otherwise `metadataBase`, the sitemap, and `robots.txt`'s `Sitemap:`
 * line will all point at localhost. See "Production Configuration
 * Required" in docs/PROJECT_STATE.md.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  return LOCAL_FALLBACK_URL;
}
