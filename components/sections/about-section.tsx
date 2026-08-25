import { RetroWindow } from "@/components/ui/retro-window";
import { SectionHeading } from "@/components/sections/section-heading";

const capabilities = [
  "Frontend Systems",
  "Backend Architecture",
  "Databases & APIs",
  "Deployment",
  "Interface Design",
];

export function AboutSection() {
  return (
    <section id="about" className="border-b-[3px] border-border bg-background">
      <div className="container-app grid gap-12 py-20 sm:py-28 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16">
        <SectionHeading
          eyebrow="// 01 ABOUT"
          title="More than code. I build the experience around it."
          description={
            <>
              <p>
                I combine full-stack development with UI/UX thinking to
                create websites and applications that don&rsquo;t just
                function correctly, but feel clear, fast, and intentional.
              </p>
              <p className="mt-4">
                With experience across modern frontend systems, backend
                architecture, databases, APIs, deployment, and interface
                design, I can take a project from an early idea to a
                production-ready product.
              </p>
            </>
          }
        />

        <RetroWindow title="capabilities.sys">
          <p className="font-retro text-lg text-muted">SYSTEM CAPABILITIES</p>
          <ul className="mt-4 space-y-3">
            {capabilities.map((capability) => (
              <li
                key={capability}
                className="flex items-center gap-3 border-b border-border/40 pb-3 font-sans text-sm font-semibold uppercase tracking-wide last:border-b-0 last:pb-0"
              >
                <span
                  className="h-2 w-2 shrink-0 bg-accent"
                  aria-hidden="true"
                />
                {capability}
              </li>
            ))}
          </ul>
        </RetroWindow>
      </div>
    </section>
  );
}
