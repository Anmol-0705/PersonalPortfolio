import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSocialIconId } from "@/lib/social-icons";
import { isSocialPlatform, socialPlatformIcon } from "@/lib/social-platforms";
import type { SocialLinkRow } from "@/types/supabase";
import type { SocialLink } from "@/types/social-link";

function mapRowToSocialLink(row: SocialLinkRow): SocialLink {
  // platform/icon are DB-constrained (CHECK) to the known ids, but the
  // type system doesn't know that — fall back to safe defaults rather
  // than trusting an unvalidated string, same defensive pattern as
  // lib/services.ts's mapRowToService.
  const platform = isSocialPlatform(row.platform) ? row.platform : "custom";
  const iconId = isSocialIconId(row.icon)
    ? row.icon
    : (platform !== "custom" ? socialPlatformIcon[platform] : "link");

  return {
    id: row.id,
    platform,
    label: row.label,
    url: row.url,
    iconId,
    enabled: row.enabled,
    order: row.sort_order,
  };
}

/**
 * RLS decides what rows come back — every row for an authenticated
 * admin session, enabled-only for anonymous visitors (see
 * supabase/migrations/0008_create_social_links_table.sql's single
 * "enabled = true or is_admin()" policy) — matching lib/projects.ts's
 * documented approach exactly. Wrapped in React's `cache()` so the
 * homepage's Connect section and the root layout's Footer (which both
 * read social links, once each, during the same request) share one
 * query instead of two — see app/layout.tsx and app/page.tsx.
 */
export const getAllSocialLinks = cache(async (): Promise<SocialLink[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("[getAllSocialLinks] Supabase query error:", error);
    return [];
  }
  return (data ?? []).map(mapRowToSocialLink);
});

/**
 * Every public-facing renderer (Connect section, footer, terminal
 * `socials` command) calls this, not getAllSocialLinks() directly.
 * RLS already scopes an anonymous request to enabled-only rows, but
 * this filters again as defense in depth: a signed-in admin's own
 * browser carries a session that satisfies `is_admin()`, so without
 * this filter their own visits to the public site would show disabled
 * links too — the same reasoning as app/sitemap.ts's published-only
 * filter (Phase 12). Disabled links must never be publicly visible
 * regardless of who's asking.
 */
export const getEnabledSocialLinks = cache(async (): Promise<SocialLink[]> => {
  const links = await getAllSocialLinks();
  return links.filter((link) => link.enabled);
});

export async function getSocialLinkById(id: string): Promise<SocialLink | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`[getSocialLinkById] Supabase query error for "${id}":`, error);
    return undefined;
  }
  return data ? mapRowToSocialLink(data) : undefined;
}
