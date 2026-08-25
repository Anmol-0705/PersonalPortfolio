"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type OptionChipProps = {
  type: "radio" | "checkbox";
  name?: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  className?: string;
};

export function OptionChip({
  type,
  name,
  value,
  checked,
  onChange,
  label,
  description,
  className,
}: OptionChipProps) {
  return (
    <label className={cn("cursor-pointer", className)}>
      <input
        type={type}
        name={type === "radio" ? name : undefined}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={cn(
          "flex items-start gap-2 border-2 px-3 py-2 font-sans text-sm font-semibold transition-colors",
          "peer-focus-visible:[outline:3px_solid_var(--color-focus)] peer-focus-visible:outline-offset-2",
          checked
            ? "border-accent bg-accent text-off-white"
            : "border-border bg-surface text-foreground hover:bg-surface-raised",
        )}
      >
        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
          {checked && <Check className="h-4 w-4" aria-hidden="true" />}
        </span>
        <span>
          {label}
          {description && (
            <span className="mt-0.5 block text-xs font-normal opacity-80">
              {description}
            </span>
          )}
        </span>
      </span>
    </label>
  );
}
