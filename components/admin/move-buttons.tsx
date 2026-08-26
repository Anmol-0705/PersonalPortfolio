"use client";

import { useTransition } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type MoveButtonsProps = {
  itemLabel: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (direction: "up" | "down") => Promise<{ success: boolean; error?: string }>;
};

const buttonClass =
  "flex h-8 w-8 items-center justify-center neo-border bg-surface-raised transition-colors hover:bg-surface focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-40";

export function MoveButtons({ itemLabel, canMoveUp, canMoveDown, onMove }: MoveButtonsProps) {
  const [isPending, startTransition] = useTransition();

  function handleMove(direction: "up" | "down") {
    startTransition(async () => {
      await onMove(direction);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => handleMove("up")}
        disabled={!canMoveUp || isPending}
        aria-label={`Move ${itemLabel} up`}
        className={cn(buttonClass)}
      >
        <ChevronUp className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => handleMove("down")}
        disabled={!canMoveDown || isPending}
        aria-label={`Move ${itemLabel} down`}
        className={cn(buttonClass)}
      >
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
