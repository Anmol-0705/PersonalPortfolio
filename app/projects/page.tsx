import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/project-grid";
import { getAllProjects } from "@/lib/projects";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: `Projects — ${siteConfig.name}`,
  description: `A collection of projects built by ${siteConfig.name}, ${siteConfig.role}.`,
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="container-app py-16 sm:py-24">
      <div className="max-w-2xl">
        <p className="font-retro text-lg tracking-wide text-accent-secondary">
          {"// PROJECTS"}
        </p>
        <h1 className="mt-2 font-sans text-3xl font-bold sm:text-5xl">
          Selected Work
        </h1>
        <p className="mt-4 font-sans text-lg text-muted">
          A collection of websites and applications built across agency,
          industrial, creative, real estate, and EdTech projects.
        </p>
      </div>

      <div className="mt-12">
        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
}
