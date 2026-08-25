import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TechBadgeVariant =
  | "purple"
  | "green"
  | "yellow"
  | "blue"
  | "pink";

export type TechBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: TechBadgeVariant;
};

const variantStyles: Record<TechBadgeVariant, string> = {
  purple: "bg-pixel-purple text-off-white",
  green: "bg-crt-green text-pure-black",
  yellow: "bg-cyber-yellow text-pure-black",
  blue: "bg-electric-blue text-pure-black",
  pink: "bg-hot-pink text-pure-black",
};

export function TechBadge({
  variant = "purple",
  className,
  children,
  ...props
}: TechBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex -rotate-2 items-center rounded-none border-2 border-pure-black px-3 py-1 font-retro text-base leading-none shadow-[3px_3px_0_0_var(--color-pure-black)] transition-transform duration-150 hover:rotate-0",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
