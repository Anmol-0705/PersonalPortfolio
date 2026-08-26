import {
  Code2,
  Briefcase,
  Mail,
  AtSign,
  Terminal,
  Trophy,
  BarChart3,
  Newspaper,
  BookOpen,
  Video,
  Globe,
  FileText,
  Link2,
  Star,
  Sparkles,
  Flag,
  Award,
  Bookmark,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Controlled icon identifiers for social/professional links. lucide-react
 * doesn't ship brand/platform logos (no Github/Linkedin/Twitter/Youtube
 * icons in this library), so every id here is a generic icon standing in
 * for its usual platform. The database stores only these string ids
 * (also enforced by a CHECK constraint — see
 * supabase/migrations/0008_create_social_links_table.sql) — never a
 * component name or anything dynamically imported. The admin UI only
 * ever assigns an id via lib/social-platforms.ts's fixed
 * platform-to-icon map (or, for platform "custom", a choice from
 * CUSTOM_SOCIAL_ICON_IDS below) — nothing in the database can add a new
 * one.
 */
export const SOCIAL_ICON_IDS = [
  "code",
  "briefcase",
  "mail",
  "at-sign",
  "terminal",
  "trophy",
  "bar-chart",
  "newspaper",
  "book-open",
  "video",
  "globe",
  "file-text",
  "link",
  "star",
  "sparkles",
  "flag",
  "award",
  "bookmark",
] as const;

export type SocialIconId = (typeof SOCIAL_ICON_IDS)[number];

export const socialIconMap: Record<SocialIconId, LucideIcon> = {
  code: Code2,
  briefcase: Briefcase,
  mail: Mail,
  "at-sign": AtSign,
  terminal: Terminal,
  trophy: Trophy,
  "bar-chart": BarChart3,
  newspaper: Newspaper,
  "book-open": BookOpen,
  video: Video,
  globe: Globe,
  "file-text": FileText,
  link: Link2,
  star: Star,
  sparkles: Sparkles,
  flag: Flag,
  award: Award,
  bookmark: Bookmark,
};

export const socialIconLabels: Record<SocialIconId, string> = {
  code: "Code",
  briefcase: "Briefcase",
  mail: "Mail",
  "at-sign": "At Sign",
  terminal: "Terminal",
  trophy: "Trophy",
  "bar-chart": "Bar Chart",
  newspaper: "Newspaper",
  "book-open": "Book",
  video: "Video",
  globe: "Globe",
  "file-text": "Document",
  link: "Link",
  star: "Star",
  sparkles: "Sparkles",
  flag: "Flag",
  award: "Award",
  bookmark: "Bookmark",
};

export function isSocialIconId(value: string): value is SocialIconId {
  return (SOCIAL_ICON_IDS as readonly string[]).includes(value);
}

/**
 * The safe, generic icon choices offered when platform = "custom" — kept
 * distinct from every platform-derived icon above so a custom link's
 * icon is visually obviously "custom," not a stand-in for a specific
 * known platform.
 */
export const CUSTOM_SOCIAL_ICON_IDS: SocialIconId[] = [
  "link",
  "star",
  "sparkles",
  "flag",
  "award",
  "bookmark",
];
