import { Rocket, Layers, PenTool, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Service = {
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
};

export const services: Service[] = [
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
