import type { Metadata } from "next";
import Link from "next/link";
import { ProjectForm } from "@/components/admin/project-form";
import { AdminNav } from "@/components/admin/admin-nav";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { getProjectById } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Edit Project",
  robots: { index: false, follow: false },
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    // Deliberately not next/navigation's notFound() here: that renders
    // the site-wide app/not-found.tsx, which escapes the admin layout
    // entirely and leaves no way back to the dashboard — confusing on
    // its own, and easy to mistake for "the Edit button is broken."
    // Staying inside this layout also keeps the real cause (a genuinely
    // missing/deleted project vs. a query error, logged server-side by
    // getProjectById) visible in context instead of masked by a generic
    // 404 page.
    return (
      <div className="flex flex-col gap-6">
        <AdminNav current="projects" />
        <h1 className="font-sans text-3xl font-bold">Project Not Found</h1>
        <NeoCard>
          <p className="font-sans text-muted">
            No project exists for id <code>{id}</code>, or it could not be
            loaded. It may have been deleted, or the link may be stale.
          </p>
          <Link href="/admin" className={neoButtonClasses("primary", "mt-4")}>
            Back to Dashboard
          </Link>
        </NeoCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminNav current="projects" />
      <h1 className="font-sans text-3xl font-bold">Edit Project</h1>
      <ProjectForm mode="edit" project={project} />
    </div>
  );
}
