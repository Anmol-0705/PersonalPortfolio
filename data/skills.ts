/**
 * Historical record of the skills that seeded public.skills (see
 * supabase/migrations/0007_seed_skills_and_services.sql). No longer
 * read by the app — lib/skills.ts now queries Supabase directly, and
 * the public/terminal-facing SkillGroup type now lives in
 * types/skill.ts. Kept for reference only.
 */
import type { TechBadgeVariant } from "@/components/ui/tech-badge";

type LegacySkillGroup = {
  label: string;
  variant: TechBadgeVariant;
  skills: string[];
};

export const skillGroups: LegacySkillGroup[] = [
  {
    label: "Frontend",
    variant: "purple",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Redux"],
  },
  {
    label: "Backend",
    variant: "green",
    skills: ["Node.js", "Express", "PHP"],
  },
  {
    label: "Data & Services",
    variant: "blue",
    skills: ["MySQL", "MongoDB", "Firebase"],
  },
  {
    label: "DevOps & Deployment",
    variant: "pink",
    skills: ["Docker", "AWS", "Git", "Vercel"],
  },
];
