import { RetroHero } from "@/components/hero/retro-hero";
import { AboutSection } from "@/components/sections/about-section";
import { ServicesSection } from "@/components/sections/services-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { EngagementSection } from "@/components/sections/engagement-section";
import { TerminalSection } from "@/components/sections/terminal-section";
import { CtaSection } from "@/components/sections/cta-section";
import { getAllProjects } from "@/lib/projects";
import { getSkillGroups } from "@/lib/skills";
import { getServices } from "@/lib/services";

export default async function HomePage() {
  const [projects, skillGroups, services] = await Promise.all([
    getAllProjects(),
    getSkillGroups(),
    getServices(),
  ]);

  return (
    <>
      <RetroHero />
      <AboutSection />
      <ServicesSection />
      <SkillsSection />
      <ProjectsSection />
      <EngagementSection />
      <TerminalSection projects={projects} skillGroups={skillGroups} services={services} />
      <CtaSection />
    </>
  );
}
