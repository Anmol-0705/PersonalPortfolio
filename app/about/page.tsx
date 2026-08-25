import type { Metadata } from "next";
import { RetroWindow } from "@/components/ui/retro-window";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: `About — ${siteConfig.name}`,
};

export default function AboutPage() {
  return (
    <div className="container-app py-16 sm:py-24">
      <RetroWindow title="about.txt" className="mx-auto max-w-2xl">
        <h1 className="font-sans text-2xl font-bold sm:text-3xl">About</h1>
        <p className="mt-4 font-sans text-muted">
          {siteConfig.name} is a {siteConfig.role} based in{" "}
          {siteConfig.location} with {siteConfig.experience} of experience
          delivering {siteConfig.projectsDelivered} projects. Full bio and
          background are coming in a future phase.
        </p>
      </RetroWindow>
    </div>
  );
}
