import { Rocket, Layers, PenTool, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NeoCard } from "@/components/ui/neo-card";
import { SectionHeading } from "@/components/sections/section-heading";

type Service = {
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
};

const services: Service[] = [
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

export function ServicesSection() {
  return (
    <section id="services" className="border-b-[3px] border-border bg-surface">
      <div className="container-app py-20 sm:py-28">
        <SectionHeading
          eyebrow="// 02 SERVICES"
          title="What I can build for you"
          align="center"
          className="mx-auto"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <NeoCard
                key={service.title}
                className="group bg-surface-raised transition-transform duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--color-border)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center border-2 border-border bg-accent text-off-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="font-retro text-base text-muted">
                    {service.label}
                  </span>
                </div>

                <h3 className="mt-5 font-sans text-xl font-bold">
                  {service.title}
                </h3>
                <p className="mt-2 font-sans text-muted">
                  {service.description}
                </p>
              </NeoCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
