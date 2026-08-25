import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/types/project";

export type ProjectGridProps = {
  projects: Project[];
  emptyMessage?: string;
};

export function ProjectGrid({
  projects,
  emptyMessage = "No projects to show yet.",
}: ProjectGridProps) {
  if (projects.length === 0) {
    return <p className="font-sans text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
