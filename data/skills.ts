import type { TechBadgeVariant } from "@/components/ui/tech-badge";

export type SkillGroup = {
  label: string;
  variant: TechBadgeVariant;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
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
