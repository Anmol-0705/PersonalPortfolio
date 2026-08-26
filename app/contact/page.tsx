import type { Metadata } from "next";
import { RetroWindow } from "@/components/ui/retro-window";
import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: `Contact — ${siteConfig.name}`,
  description: `Get in touch with ${siteConfig.name} to discuss a project.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container-app py-16 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="font-retro text-lg tracking-wide text-accent-secondary">
            {"// CONTACT"}
          </p>
          <h1 className="mt-2 font-sans text-3xl font-bold sm:text-5xl">
            Let&rsquo;s talk about your project.
          </h1>
          <p className="mt-4 font-sans text-lg text-muted">
            Whether it&rsquo;s a quick sprint or a full build, tell me what
            you&rsquo;re working on and I&rsquo;ll get back to you. Final
            pricing always depends on scope, features, and timeline.
          </p>

          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-6 inline-block font-sans text-lg underline decoration-2 underline-offset-4 hover:text-accent focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
          >
            {siteConfig.email}
          </a>

          <p className="mt-2 font-retro text-base text-muted">
            {siteConfig.availability} &middot; {siteConfig.location}
          </p>
        </div>

        <RetroWindow title="contact.exe">
          <ContactForm />
        </RetroWindow>
      </div>
    </div>
  );
}
