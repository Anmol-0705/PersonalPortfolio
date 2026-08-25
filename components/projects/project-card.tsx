import Link from "next/link";
import { NeoCard } from "@/components/ui/neo-card";
import { TechBadge } from "@/components/ui/tech-badge";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { ProjectMedia } from "@/components/projects/project-media";
import type { Project } from "@/types/project";

export type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <NeoCard
      accentShadow={project.featured}
      className="group relative flex flex-col bg-surface-raised p-0 transition-transform duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--color-border)]"
    >
      {project.featured && (
        <span className="absolute left-4 top-4 z-10 border-2 border-pure-black bg-cyber-yellow px-2 py-0.5 font-retro text-sm tracking-wide text-pure-black">
          FEATURED
        </span>
      )}

      <ProjectMedia project={project} className="border-b-[3px] border-border" />

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="font-retro text-base tracking-wide text-muted">
          {project.category}
        </p>
        <h3 className="mt-1 font-sans text-xl font-bold">{project.title}</h3>
        <p className="mt-2 flex-1 font-sans text-sm text-muted">
          {project.shortDescription}
        </p>

        {project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <TechBadge key={tech} variant="yellow" className="text-sm">
                {tech}
              </TechBadge>
            ))}
          </div>
        )}

        <Link
          href={`/projects/${project.slug}`}
          className={neoButtonClasses("secondary", "mt-6 w-full")}
        >
          View Project
        </Link>
      </div>
    </NeoCard>
  );
}
