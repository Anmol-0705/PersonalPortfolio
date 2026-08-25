import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type NeoButtonVariant = "primary" | "secondary" | "ghost";

export type NeoButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: NeoButtonVariant;
};

const variantStyles: Record<NeoButtonVariant, string> = {
  primary: "bg-accent text-off-white border-border",
  secondary: "bg-surface text-foreground border-border",
  ghost: "bg-transparent text-foreground border-transparent",
};

/**
 * Shared class builder so link-based CTAs (e.g. `next/link`) can look like a
 * NeoButton without nesting an anchor inside a real `<button>` element.
 */
export function neoButtonClasses(
  variant: NeoButtonVariant = "primary",
  className?: string,
) {
  const isGhost = variant === "ghost";

  return cn(
    "inline-flex items-center justify-center gap-2 rounded-none px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wide transition-all duration-150 ease-out",
    "neo-border-thick",
    !isGhost && "neo-shadow",
    !isGhost &&
      "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-border)]",
    !isGhost &&
      "active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0_0_var(--color-border)]",
    isGhost && "hover:bg-surface",
    "focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    className,
  );
}

export const NeoButton = forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ variant = "primary", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={neoButtonClasses(variant, className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

NeoButton.displayName = "NeoButton";
