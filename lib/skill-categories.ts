import type { TechBadgeVariant } from "@/components/ui/tech-badge";

/**
 * Category display colors are a UI concern, not content — kept as a
 * controlled map in code rather than a column in the database, the same
 * reasoning as the service icon map. The four keys match the categories
 * that existed in data/skills.ts before the Supabase migration; a new
 * category the admin adds later still renders correctly via the
 * fallback, it just won't have a distinct assigned color until this map
 * is updated.
 */
const CATEGORY_VARIANTS: Record<string, TechBadgeVariant> = {
  Frontend: "purple",
  Backend: "green",
  "Data & Services": "blue",
  "DevOps & Deployment": "pink",
};

const DEFAULT_VARIANT: TechBadgeVariant = "yellow";

export function variantForCategory(category: string): TechBadgeVariant {
  return CATEGORY_VARIANTS[category] ?? DEFAULT_VARIANT;
}

/** Known categories, offered as suggestions in the admin form — not a hard constraint. */
export const KNOWN_SKILL_CATEGORIES = Object.keys(CATEGORY_VARIANTS);
