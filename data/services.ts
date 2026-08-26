/**
 * Historical record of the services that seeded public.services (see
 * supabase/migrations/0007_seed_skills_and_services.sql). No longer
 * read by the app — lib/services.ts now queries Supabase directly, and
 * the public-facing Service type now lives in types/service.ts. Kept
 * for reference only.
 */
import { Rocket, Layers, PenTool, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type LegacyService = {
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
};

export const services: LegacyService[] = [
  {
    icon: Rocket,
    label: "SVC_01",
    title: "High-Converting Websites",
    description:
      "Landing pages, portfolio sites, business websites, and marketing experiences designed to look sharp and guide visitors toward action.",
  },
  {
    icon: Layers,
    label: "SVC_02",
    title: "Full-Stack Web Applications",
    description:
      "Scalable web applications with modern frontends, backend APIs, databases, authentication, and production-ready architecture.",
  },
  {
    icon: PenTool,
    label: "SVC_03",
    title: "UI/UX Design & Frontend Systems",
    description:
      "Interfaces, design systems, responsive layouts, and polished frontend experiences built around clarity and usability.",
  },
  {
    icon: Wrench,
    label: "SVC_04",
    title: "Fixes, Upgrades & Technical Sprints",
    description:
      "Bug fixing, UI improvements, performance work, architecture analysis, feature development, and focused development sprints.",
  },
];
