import type { Metadata } from "next";
import Link from "next/link";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { serviceIconMap } from "@/lib/service-icons";
import { getServices } from "@/lib/services";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: `Services — ${siteConfig.name}`,
  description: `Services offered by ${siteConfig.name}, ${siteConfig.role}.`,
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="container-app py-16 sm:py-24">
      <div className="max-w-2xl">
        <p className="font-retro text-lg tracking-wide text-accent-secondary">
          {"// SERVICES"}
        </p>
        <h1 className="mt-2 font-sans text-3xl font-bold sm:text-5xl">
          What I Can Build For You
        </h1>
        <p className="mt-4 font-sans text-lg text-muted">
          From focused sprints to full-scale builds, here&rsquo;s where I can
          help. Final pricing always depends on scope — the engagement
          options below are a starting point for a conversation.
        </p>
      </div>

      {services.length > 0 && (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((service, index) => {
            const Icon = serviceIconMap[service.iconId];
            return (
              <NeoCard key={service.id} className="bg-surface-raised">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center border-2 border-border bg-accent text-off-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="font-retro text-base text-muted">
                    {`SVC_${String(index + 1).padStart(2, "0")}`}
                  </span>
                </div>
                <h2 className="mt-5 font-sans text-xl font-bold">
                  {service.title}
                </h2>
                <p className="mt-2 font-sans text-muted">
                  {service.description}
                </p>
              </NeoCard>
            );
          })}
        </div>
      )}

      <div className="mt-12 flex flex-wrap gap-4">
        <Link href="/#engagement" className={neoButtonClasses("primary")}>
          See Engagement Options
        </Link>
        <Link href="/contact" className={neoButtonClasses("secondary")}>
          Start a Conversation
        </Link>
      </div>
    </div>
  );
}
