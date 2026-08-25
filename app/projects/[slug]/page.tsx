import { RetroWindow } from "@/components/ui/retro-window";
import { siteConfig } from "@/data/site-config";

export default async function ProjectCaseStudyPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;

  return (
    <div className="container-app py-16 sm:py-24">
      <RetroWindow title={`projects/${slug}`} className="mx-auto max-w-2xl">
        <h1 className="font-sans text-2xl font-bold sm:text-3xl">
          Case Study
        </h1>
        <p className="mt-4 font-sans text-muted">
          The case study for &ldquo;{slug}&rdquo; is coming in a future
          phase. In the meantime, reach out to {siteConfig.name} directly at{" "}
          {siteConfig.email}.
        </p>
      </RetroWindow>
    </div>
  );
}
