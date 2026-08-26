import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { AdminNav } from "@/components/admin/admin-nav";
import { ProjectThumbnail } from "@/components/admin/project-thumbnail";
import { PublishedBadge, FeaturedBadge } from "@/components/admin/status-badges";
import { getAllProjects, getRecentProjects } from "@/lib/projects";
import { getAllSkills } from "@/lib/skills";
import { getServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

const RECENT_PROJECTS_LIMIT = 5;

export default async function AdminDashboardPage() {
  const [projects, skills, services, recentProjects] = await Promise.all([
    getAllProjects(),
    getAllSkills(),
    getServices(),
    getRecentProjects(RECENT_PROJECTS_LIMIT),
  ]);

  const publishedCount = projects.filter((project) => project.published).length;
  const draftCount = projects.length - publishedCount;
  const featuredCount = projects.filter((project) => project.featured).length;
  const withImageCount = projects.filter((project) => project.media?.coverImage).length;
  const skillCategoryCount = new Set(skills.map((skill) => skill.category)).size;

  return (
    <div className="flex flex-col gap-8">
      <AdminNav current="dashboard" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-sans text-3xl font-bold">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/projects/new" className={neoButtonClasses("primary", "text-sm")}>
            + New Project
          </Link>
          <Link href="/admin/skills/new" className={neoButtonClasses("secondary", "text-sm")}>
            + Add Skill
          </Link>
          <Link href="/admin/services/new" className={neoButtonClasses("secondary", "text-sm")}>
            + Add Service
          </Link>
        </div>
      </div>

      <section aria-labelledby="projects-stats-heading" className="flex flex-col gap-3">
        <h2 id="projects-stats-heading" className="font-retro text-lg tracking-wide text-muted">
          Projects
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Projects" value={projects.length} />
          <StatCard label="Published" value={publishedCount} />
          <StatCard label="Drafts" value={draftCount} />
          <StatCard label="Featured" value={featuredCount} />
        </div>
      </section>

      <section aria-labelledby="content-stats-heading" className="flex flex-col gap-3">
        <h2 id="content-stats-heading" className="font-retro text-lg tracking-wide text-muted">
          Images, Skills &amp; Services
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="With Cover Image" value={withImageCount} />
          <StatCard label="Without Cover Image" value={projects.length - withImageCount} />
          <StatCard label="Total Skills" value={skills.length} sub={`${skillCategoryCount} categories`} />
          <StatCard label="Total Services" value={services.length} />
        </div>
      </section>

      <section aria-labelledby="recent-projects-heading" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="recent-projects-heading" className="font-sans text-xl font-bold">
            Recent Projects
          </h2>
          <Link href="/admin/projects" className={neoButtonClasses("secondary", "text-sm")}>
            View All Projects
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <NeoCard>
            <p className="font-sans text-muted">No projects yet.</p>
            <Link href="/admin/projects/new" className={neoButtonClasses("primary", "mt-4")}>
              Create Project
            </Link>
          </NeoCard>
        ) : (
          <div className="flex flex-col gap-3">
            {recentProjects.map((project) => (
              <NeoCard
                key={project.id}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <ProjectThumbnail src={project.media?.coverImage} alt={project.title} />
                  <div>
                    <h3 className="font-sans text-base font-bold">{project.title}</h3>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      <PublishedBadge published={project.published} />
                      {project.featured && <FeaturedBadge />}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className={neoButtonClasses("secondary", "text-sm")}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                </Link>
              </NeoCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <NeoCard>
      <p className="font-retro text-base tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-sans text-3xl font-bold">{value}</p>
      {sub && <p className="mt-1 font-sans text-xs text-muted">{sub}</p>}
    </NeoCard>
  );
}
