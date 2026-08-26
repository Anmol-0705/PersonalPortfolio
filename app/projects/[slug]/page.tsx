import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCaseStudy } from "@/components/projects/project-case-study";
import { getProjectBySlug } from "@/lib/projects";
import { siteConfig } from "@/data/site-config";

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    // Not indexable — this metadata is only ever seen alongside the
    // notFound() render below, which already returns a 404 status.
    return {
      title: `Project Not Found — ${siteConfig.name}`,
      robots: { index: false, follow: false },
    };
  }

  const title = `${project.title} — ${siteConfig.name}`;

  return {
    title,
    description: project.shortDescription,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description: project.shortDescription,
      type: "article",
      // Falls back to the site-wide default OG image (app/opengraph-image.tsx)
      // when the project has no cover image — never fabricated.
      images: project.media?.coverImage ? [{ url: project.media.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.shortDescription,
      images: project.media?.coverImage ? [project.media.coverImage] : undefined,
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectCaseStudy project={project} />;
}
