import Link from "next/link";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { RetroWindow } from "@/components/ui/retro-window";
import { TechBadge } from "@/components/ui/tech-badge";
import { siteConfig } from "@/data/site-config";

export default function HomePage() {
  return (
    <div className="bg-grid">
      <div className="container-app flex min-h-[calc(100dvh-4rem-1px)] items-center py-16 sm:py-24">
        <RetroWindow title="anmol_kumar.exe" className="w-full max-w-2xl">
          <p className="font-retro text-lg text-muted">
            {siteConfig.availability}
          </p>
          <h1 className="mt-2 font-sans text-3xl font-bold sm:text-5xl">
            {siteConfig.name}
          </h1>
          <p className="mt-3 font-sans text-lg text-muted sm:text-xl">
            {siteConfig.role}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <TechBadge variant="purple">{siteConfig.experience} experience</TechBadge>
            <TechBadge variant="green">{siteConfig.projectsDelivered} projects</TechBadge>
            <TechBadge variant="yellow">{siteConfig.location}</TechBadge>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/projects" className={neoButtonClasses("primary")}>
              View Projects
            </Link>
            <Link href="/contact" className={neoButtonClasses("secondary")}>
              Get in Touch
            </Link>
          </div>
        </RetroWindow>
      </div>
    </div>
  );
}
