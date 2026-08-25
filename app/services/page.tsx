import type { Metadata } from "next";
import { RetroWindow } from "@/components/ui/retro-window";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: `Services — ${siteConfig.name}`,
};

export default function ServicesPage() {
  return (
    <div className="container-app py-16 sm:py-24">
      <RetroWindow title="services/" className="mx-auto max-w-2xl">
        <h1 className="font-sans text-2xl font-bold sm:text-3xl">Services</h1>
        <p className="mt-4 font-sans text-muted">
          A full breakdown of engagement models and services is coming in a
          future phase.
        </p>
      </RetroWindow>
    </div>
  );
}
