import Link from "next/link";
import { ProjectGrid } from "@/components/projects/project-grid";
import { SectionHeading } from "@/components/sections/section-heading";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { getAllProjects, getFeaturedProjects } from "@/lib/projects";

export async function ProjectsSection() {
  const [featuredProjects, allProjects] = await Promise.all([
    getFeaturedProjects(),
    getAllProjects(),
  ]);
  const otherProjects = allProjects.filter((project) => !project.featured);

  return (
    <section id="projects" className="border-b-[3px] border-border bg-surface">
      <div className="container-app py-20 sm:py-28">
        <SectionHeading
          eyebrow="// 04 SELECTED WORK"
          title="Featured Projects"
        />

        <div className="mt-12">
          <ProjectGrid projects={featuredProjects} />
        </div>

        {otherProjects.length > 0 && (
          <p className="mt-8 font-sans text-sm text-muted">
            Plus {otherProjects.map((project) => project.title).join(" and ")}
            , available in the full project showcase.
          </p>
        )}

        <Link href="/projects" className={neoButtonClasses("primary", "mt-6")}>
          View All Projects
        </Link>
      </div>
    </section>
  );
}
