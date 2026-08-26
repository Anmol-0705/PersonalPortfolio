import type { SocialIconId } from "@/lib/social-icons";

/**
 * Controlled platform identifiers — also enforced by a CHECK constraint
 * (see supabase/migrations/0008_create_social_links_table.sql). The
 * admin form's platform selector only ever offers these; every platform
 * except "custom" has a fixed, non-editable icon (below), so the only
 * place an admin picks an icon directly is for a "custom" link.
 */
export const SOCIAL_PLATFORMS = [
  "github",
  "linkedin",
  "email",
  "twitter",
  "leetcode",
  "hackerrank",
  "kaggle",
  "devto",
  "medium",
  "youtube",
  "website",
  "resume",
  "custom",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const socialPlatformLabels: Record<SocialPlatform, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  email: "Email",
  twitter: "X / Twitter",
  leetcode: "LeetCode",
  hackerrank: "HackerRank",
  kaggle: "Kaggle",
  devto: "Dev.to",
  medium: "Medium",
  youtube: "YouTube",
  website: "Website",
  resume: "Resume",
  custom: "Custom",
};

/**
 * The fixed icon every non-custom platform renders with — an admin
 * cannot override this, so a "GitHub" link always looks like a GitHub
 * link regardless of what's typed elsewhere in the form. Deliberately
 * excludes "custom", which has its own admin-chosen icon instead (see
 * CUSTOM_SOCIAL_ICON_IDS in lib/social-icons.ts).
 */
export const socialPlatformIcon: Record<Exclude<SocialPlatform, "custom">, SocialIconId> = {
  github: "code",
  linkedin: "briefcase",
  email: "mail",
  twitter: "at-sign",
  leetcode: "terminal",
  hackerrank: "trophy",
  kaggle: "bar-chart",
  devto: "newspaper",
  medium: "book-open",
  youtube: "video",
  website: "globe",
  resume: "file-text",
};

export function isSocialPlatform(value: string): value is SocialPlatform {
  return (SOCIAL_PLATFORMS as readonly string[]).includes(value);
}
