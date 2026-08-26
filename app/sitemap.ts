import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const projects = await getAllProjects();

  // Defense in depth: RLS already returns published-only rows for an
  // anonymous request, but this route reads request cookies like any
  // other Server Component, so a signed-in admin's own browser session
  // would otherwise see draft rows here too. The sitemap must never list
  // a draft/unpublished project regardless of who (or what) requests it.
  const publishedProjects = projects.filter((project) => project.published);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/services`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = publishedProjects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
