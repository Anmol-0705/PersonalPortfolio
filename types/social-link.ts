import type { SocialPlatform } from "@/lib/social-platforms";
import type { SocialIconId } from "@/lib/social-icons";

export type SocialLink = {
  id: string;
  platform: SocialPlatform;
  label: string;
  /**
   * A plain email address when platform is "email" (no `mailto:`
   * prefix — constructed at render time); a full absolute URL for
   * every other platform. See
   * supabase/migrations/0008_create_social_links_table.sql.
   */
  url: string;
  iconId: SocialIconId;
  enabled: boolean;
  order: number;
};
