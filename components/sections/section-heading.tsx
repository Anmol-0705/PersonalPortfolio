import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="font-retro text-lg tracking-wide text-accent-secondary">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-sans text-3xl font-bold sm:text-4xl">
        {title}
      </h2>
      {description && (
        <div className="mt-4 font-sans text-muted sm:text-lg">
          {description}
        </div>
      )}
    </div>
  );
}
