import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { ProjectsAdminList } from "@/components/admin/projects-admin-list";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Manage Projects",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  const rows = projects.map((project, index) => ({
    project,
    canMoveUp: index > 0,
    canMoveDown: index < projects.length - 1,
  }));

  return (
    <div className="flex flex-col gap-6">
      <AdminNav current="projects" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-sans text-3xl font-bold">Projects</h1>
        <Link href="/admin/projects/new" className={neoButtonClasses("primary")}>
          + New Project
        </Link>
      </div>

      <ProjectsAdminList rows={rows} />
    </div>
  );
}
