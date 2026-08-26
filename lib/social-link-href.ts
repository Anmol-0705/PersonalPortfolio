import type { SocialLink } from "@/types/social-link";

/**
 * Shared by every public renderer of a SocialLink (Connect section,
 * footer, terminal `socials` command) so the email-vs-URL href logic
 * lives in exactly one place. `email` links store a plain address (see
 * types/social-link.ts) and become a `mailto:` link here; every other
 * platform is treated as an external link that should open safely in a
 * new tab (`target="_blank" rel="noopener noreferrer"`).
 */
export function socialLinkHref(link: SocialLink): { href: string; isExternal: boolean } {
  if (link.platform === "email") {
    return { href: `mailto:${link.url}`, isExternal: false };
  }
  return { href: link.url, isExternal: true };
}
