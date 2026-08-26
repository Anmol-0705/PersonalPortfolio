import type { TechBadgeVariant } from "@/components/ui/tech-badge";

/** A single admin-managed skill row. */
export type Skill = {
  id: string;
  name: string;
  category: string;
  order: number;
};

/** Public homepage shape: skills grouped by category for display. */
export type SkillGroup = {
  label: string;
  variant: TechBadgeVariant;
  skills: string[];
};
