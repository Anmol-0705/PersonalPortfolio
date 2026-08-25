import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type NeoCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Use the heavier 3px border + larger offset shadow. Defaults to true. */
  thick?: boolean;
  /** Tint the hard shadow with the accent color instead of the border color. */
  accentShadow?: boolean;
};

export function NeoCard({
  thick = true,
  accentShadow = false,
  className,
  children,
  ...props
}: NeoCardProps) {
  return (
    <div
      className={cn(
        "rounded-none bg-surface p-6 sm:p-8",
        thick ? "neo-border-thick" : "neo-border",
        accentShadow ? "neo-shadow-accent" : "neo-shadow",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
