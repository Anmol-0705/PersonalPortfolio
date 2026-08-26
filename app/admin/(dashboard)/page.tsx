import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { PublishToggleButton } from "@/components/admin/publish-toggle-button";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const projects = await getAllProjects();
  const publishedCount = projects.filter((project) => project.published).length;
  const draftCount = projects.length - publishedCount;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-sans text-3xl font-bold">Projects</h1>
        <Link href="/admin/projects/new" className={neoButtonClasses("primary")}>
          + New Project
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Projects" value={projects.length} />
        <StatCard label="Published" value={publishedCount} />
        <StatCard label="Drafts" value={draftCount} />
      </div>

      {projects.length === 0 ? (
        <NeoCard>
          <p className="font-sans text-muted">
            No projects yet. Create your first one.
          </p>
        </NeoCard>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <NeoCard
              key={project.id}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-sans text-lg font-bold">{project.title}</h2>
                  <StatusBadge published={project.published} />
                  {project.featured && (
                    <span className="font-retro text-sm tracking-wide text-accent-secondary">
                      FEATURED
                    </span>
                  )}
                </div>
                <p className="mt-1 font-sans text-sm text-muted">
                  /{project.slug} · {project.category || "Uncategorized"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className={neoButtonClasses("secondary", "text-sm")}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                </Link>
                <PublishToggleButton id={project.id} published={project.published} />
                <DeleteProjectButton id={project.id} title={project.title} />
              </div>
            </NeoCard>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <NeoCard>
      <p className="font-retro text-base tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-sans text-3xl font-bold">{value}</p>
    </NeoCard>
  );
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`font-retro text-sm tracking-wide ${published ? "text-crt-green" : "text-muted"}`}
    >
      {published ? "PUBLISHED" : "DRAFT"}
    </span>
  );
}
