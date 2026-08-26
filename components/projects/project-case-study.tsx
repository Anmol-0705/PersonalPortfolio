import Link from "next/link";
import { ArrowLeft, ExternalLink, Code2 } from "lucide-react";
import { TechBadge } from "@/components/ui/tech-badge";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { ProjectMedia } from "@/components/projects/project-media";
import type { Project } from "@/types/project";

export type ProjectCaseStudyProps = {
  project: Project;
};

const narrativeSections: {
  key: "problem" | "approach" | "solution";
  heading: string;
}[] = [
  { key: "problem", heading: "The Problem" },
  { key: "approach", heading: "The Approach" },
  { key: "solution", heading: "The Solution" },
];

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const hasExternalLinks = Boolean(project.liveUrl || project.githubUrl);

  return (
    <article className="bg-background">
      <div className="container-app py-16 sm:py-24">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-accent focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Projects
        </Link>

        <header className="mt-6 max-w-3xl">
          <p className="font-retro text-lg tracking-wide text-accent-secondary">
            {project.category}
          </p>
          <h1 className="mt-2 font-sans text-3xl font-bold sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 font-sans text-lg text-muted">
            {project.shortDescription}
          </p>

          {project.technologies.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <TechBadge key={tech} variant="purple">
                  {tech}
                </TechBadge>
              ))}
            </div>
          )}

          {hasExternalLinks && (
            <div className="mt-6 flex flex-wrap gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={neoButtonClasses("primary")}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Visit Live Site
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={neoButtonClasses("secondary")}
                >
                  <Code2 className="h-4 w-4" aria-hidden="true" />
                  View Code
                </a>
              )}
            </div>
          )}
        </header>

        <ProjectMedia
          project={project}
          className="mt-10 neo-border-thick neo-shadow max-w-4xl"
        />

        <div className="mt-12 max-w-3xl space-y-10">
          {narrativeSections.map(({ key, heading }) => {
            const content = project[key];
            if (!content) return null;

            return (
              <section key={key}>
                <h2 className="font-sans text-2xl font-bold">{heading}</h2>
                <p className="mt-3 font-sans text-muted">{content}</p>
              </section>
            );
          })}

          {project.testimonial && (
            <NeoCard accentShadow>
              <blockquote>
                <p className="font-sans text-lg italic">
                  &ldquo;{project.testimonial.quote}&rdquo;
                </p>
                <footer className="mt-4 font-retro text-base text-muted">
                  {project.testimonial.author}
                </footer>
              </blockquote>
            </NeoCard>
          )}
        </div>

        <div className="mt-16 flex flex-wrap gap-4 border-t-[3px] border-border pt-8">
          <Link href="/projects" className={neoButtonClasses("secondary")}>
            Back to All Projects
          </Link>
          <Link href="/contact" className={neoButtonClasses("primary")}>
            Start a Project
          </Link>
        </div>
      </div>
    </article>
  );
}
