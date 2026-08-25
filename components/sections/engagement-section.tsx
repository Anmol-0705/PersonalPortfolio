"use client";

import { useState } from "react";
import { Zap, Blocks } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { SectionHeading } from "@/components/sections/section-heading";
import { EngagementSelector } from "@/components/engagement/engagement-selector";
import type { EngagementType } from "@/types/quote";

type EngagementOption = {
  type: EngagementType;
  icon: LucideIcon;
  label: string;
  title: string;
  details: string;
  suitableFor: string[];
  cta: string;
};

const engagementOptions: EngagementOption[] = [
  {
    type: "quick-sprint",
    icon: Zap,
    label: "QUICK SPRINT",
    title: "Daily / Hourly Hire",
    details: "₹2000 / 5 Hours",
    suitableFor: [
      "Bug fixes",
      "UI improvements",
      "Technical analysis",
      "Feature development",
      "Focused development sprints",
    ],
    cta: "Discuss a Sprint",
  },
  {
    type: "full-build",
    icon: Blocks,
    label: "FULL BUILD",
    title: "End-to-End Project",
    details: "Custom Scope + Pricing",
    suitableFor: [
      "Complete websites",
      "Web applications",
      "SaaS products",
      "Business platforms",
      "Custom digital products",
    ],
    cta: "Plan a Project",
  },
];

export function EngagementSection() {
  const [activeType, setActiveType] = useState<EngagementType | null>(null);

  return (
    <section id="engagement" className="border-b-[3px] border-border bg-background">
      <div className="container-app py-20 sm:py-28">
        <SectionHeading
          eyebrow="// 05 ENGAGEMENT"
          title="Ways to work together"
          description="Final pricing always depends on scope. Pick a starting point below and configure the details."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {engagementOptions.map((option) => {
            const Icon = option.icon;
            return (
              <NeoCard key={option.title} accentShadow className="flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center border-2 border-border bg-accent-secondary text-pure-black">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-retro text-base tracking-wide text-muted">
                    {option.label}
                  </span>
                </div>

                <h3 className="mt-4 font-sans text-2xl font-bold">
                  {option.title}
                </h3>
                <p className="mt-1 font-sans text-lg text-accent-secondary">
                  {option.details}
                </p>

                <ul className="mt-4 flex-1 space-y-2">
                  {option.suitableFor.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 font-sans text-sm text-muted"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 bg-border" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setActiveType(option.type)}
                  aria-expanded={activeType === option.type}
                  className={neoButtonClasses("primary", "mt-6")}
                >
                  {option.cta}
                </button>
              </NeoCard>
            );
          })}
        </div>

        {activeType && (
          <div className="mt-12">
            <EngagementSelector key={activeType} initialType={activeType} />
          </div>
        )}
      </div>
    </section>
  );
}
