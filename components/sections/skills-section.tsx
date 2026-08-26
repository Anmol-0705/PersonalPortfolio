import { TechBadge } from "@/components/ui/tech-badge";
import { SectionHeading } from "@/components/sections/section-heading";
import { skillGroups } from "@/data/skills";

export function SkillsSection() {
  return (
    <section className="border-b-[3px] border-border bg-background">
      <div className="container-app py-20 sm:py-28">
        <SectionHeading
          eyebrow="// 03 STACK"
          title="Tools I build with"
        />

        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <p className="font-retro text-lg tracking-wide text-muted">
                {group.label.toUpperCase()}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {group.skills.map((skill) => (
                  <TechBadge key={skill} variant={group.variant}>
                    {skill}
                  </TechBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
