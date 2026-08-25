import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

export type ProjectMediaProps = {
  project: Project;
  className?: string;
};

export function ProjectMedia({ project, className }: ProjectMediaProps) {
  const cover = project.media?.coverImage;

  if (cover) {
    return (
      <div className={cn("relative aspect-video overflow-hidden bg-background", className)}>
        <Image
          src={cover}
          alt={`${project.title} preview`}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${project.title} preview not yet available`}
      className={cn(
        "flex aspect-video items-center justify-center bg-background",
        className,
      )}
    >
      <div aria-hidden="true" className="flex flex-col items-center gap-2 text-muted">
        <ImageOff className="h-6 w-6" />
        <span className="font-retro text-base tracking-wide">
          MEDIA COMING SOON
        </span>
      </div>
    </div>
  );
}
