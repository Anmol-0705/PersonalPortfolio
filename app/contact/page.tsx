import type { Metadata } from "next";
import { RetroWindow } from "@/components/ui/retro-window";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: `Contact — ${siteConfig.name}`,
};

export default function ContactPage() {
  return (
    <div className="container-app py-16 sm:py-24">
      <RetroWindow title="contact.exe" className="mx-auto max-w-2xl">
        <h1 className="font-sans text-2xl font-bold sm:text-3xl">Contact</h1>
        <p className="mt-4 font-sans text-muted">
          The contact form is coming in a future phase. Until then, reach out
          directly.
        </p>
        <a
          href={`mailto:${siteConfig.email}`}
          className="mt-4 inline-block font-sans underline decoration-2 underline-offset-4 hover:text-accent focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
        >
          {siteConfig.email}
        </a>
      </RetroWindow>
    </div>
  );
}
