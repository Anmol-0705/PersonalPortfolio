"use client";

import { cn } from "@/lib/utils";

export type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Show the label text visibly instead of only exposing it to screen readers. */
  showLabel?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Toggle({
  checked,
  onChange,
  label,
  showLabel = false,
  disabled = false,
  className,
}: ToggleProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-3",
        disabled && "opacity-50",
        className,
      )}
    >
      {showLabel && (
        <span className="font-retro text-lg leading-none">{label}</span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={showLabel ? undefined : label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-none border-2 border-border transition-colors duration-150",
          "focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2",
          checked ? "bg-accent" : "bg-surface-raised",
          disabled && "cursor-not-allowed",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-none border-2 border-border bg-off-white transition-transform duration-150",
            checked && "translate-x-5",
          )}
        />
      </button>
    </label>
  );
}
