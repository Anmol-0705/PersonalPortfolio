import type { Metadata } from "next";
import { RetroWindow } from "@/components/ui/retro-window";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: `Projects — ${siteConfig.name}`,
};

export default function ProjectsPage() {
  return (
    <div className="container-app py-16 sm:py-24">
      <RetroWindow title="projects/" className="mx-auto max-w-2xl">
        <h1 className="font-sans text-2xl font-bold sm:text-3xl">Projects</h1>
        <p className="mt-4 font-sans text-muted">
          The full project showcase is coming in a future phase. Check back
          soon for case studies from {siteConfig.projectsDelivered} delivered
          projects.
        </p>
      </RetroWindow>
    </div>
  );
}
