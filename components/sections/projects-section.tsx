import Link from "next/link";
import { ImageOff } from "lucide-react";
import { NeoCard } from "@/components/ui/neo-card";
import { TechBadge } from "@/components/ui/tech-badge";
import { SectionHeading } from "@/components/sections/section-heading";
import { neoButtonClasses } from "@/components/ui/neo-button";

type FeaturedProject = {
  slug: string;
  name: string;
  category: string;
  description: string;
  tech: string[];
};

const featuredProjects: FeaturedProject[] = [
  {
    slug: "the-creation-edit",
    name: "The-Creation-Edit",
    category: "Agency Website",
    description:
      "A visually engaging website for a video editing agency built with React, Tailwind CSS, and Framer Motion.",
    tech: ["React", "Tailwind CSS", "Framer Motion"],
  },
  {
    slug: "electrotrans-solutions",
    name: "ElectroTrans Solutions",
    category: "B2B / Industrial",
    description:
      "An industrial B2B website created for a transformer manufacturer, focused on presenting technical services and business capabilities clearly.",
    tech: ["React", "Tailwind CSS"],
  },
  {
    slug: "sundown-studios",
    name: "Sundown Studios",
    category: "Interior Design",
    description:
      "A sleek interior design experience featuring smooth interactions and a dynamic visual gallery.",
    tech: ["React", "Framer Motion"],
  },
];

const otherProjects = ["Property Dealer Web App", "Teaching Institute Portal"];

export function ProjectsSection() {
  return (
    <section id="projects" className="border-b-[3px] border-border bg-surface">
      <div className="container-app py-20 sm:py-28">
        <SectionHeading
          eyebrow="// 04 SELECTED WORK"
          title="Featured Projects"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <NeoCard key={project.slug} className="flex flex-col bg-surface-raised p-0">
              <div className="flex aspect-video items-center justify-center border-b-[3px] border-border bg-background">
                <div className="flex flex-col items-center gap-2 text-muted">
                  <ImageOff className="h-6 w-6" aria-hidden="true" />
                  <span className="font-retro text-base tracking-wide">
                    MEDIA COMING SOON
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <p className="font-retro text-base tracking-wide text-muted">
                  {project.category}
                </p>
                <h3 className="mt-1 font-sans text-xl font-bold">
                  {project.name}
                </h3>
                <p className="mt-2 flex-1 font-sans text-sm text-muted">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <TechBadge key={tech} variant="yellow" className="text-sm">
                      {tech}
                    </TechBadge>
                  ))}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className={neoButtonClasses("secondary", "mt-6 w-full")}
                >
                  View Project
                </Link>
              </div>
            </NeoCard>
          ))}
        </div>

        <p className="mt-8 font-sans text-sm text-muted">
          Plus {otherProjects.join(" and ")}, available in the full project
          showcase.
        </p>

        <Link href="/projects" className={neoButtonClasses("primary", "mt-6")}>
          View All Projects
        </Link>
      </div>
    </section>
  );
}
