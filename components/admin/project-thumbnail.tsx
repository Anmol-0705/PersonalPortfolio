import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectThumbnail({
  src,
  alt,
  className,
}: {
  src: string | undefined;
  alt: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative aspect-video w-20 shrink-0 overflow-hidden neo-border bg-background", className)}>
        <Image src={src} alt={alt} fill sizes="80px" className="object-cover" />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${alt} — no cover image`}
      className={cn(
        "flex aspect-video w-20 shrink-0 items-center justify-center neo-border bg-background text-muted",
        className,
      )}
    >
      <ImageOff className="h-4 w-4" aria-hidden="true" />
    </div>
  );
}
