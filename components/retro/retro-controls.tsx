"use client";

import { useEffect, useRef, useState } from "react";
import { MonitorCog } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useCrtMode } from "@/hooks/use-crt-mode";
import { useCursorTrail } from "@/hooks/use-cursor-trail";
import { useSound } from "@/hooks/use-sound";

export function RetroControls() {
  const [open, setOpen] = useState(false);
  const [crt, setCrt] = useCrtMode();
  const [trail, setTrail] = useCursorTrail();
  const sound = useSound();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="fixed right-4 bottom-4 z-40">
      {open && (
        <div
          id="retro-controls-panel"
          className="mb-3 w-56 neo-border-thick neo-shadow bg-surface p-4"
        >
          <p className="font-retro text-lg tracking-wide text-accent-secondary">
            DISPLAY / FX
          </p>

          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-sans text-sm font-semibold uppercase tracking-wide">
                CRT
              </span>
              <Toggle
                checked={crt}
                onChange={(next) => {
                  setCrt(next);
                  sound.playToggle();
                }}
                label="Toggle CRT scanline effect"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="font-sans text-sm font-semibold uppercase tracking-wide">
                Trail
              </span>
              <Toggle
                checked={trail}
                onChange={(next) => {
                  setTrail(next);
                  sound.playToggle();
                }}
                label="Toggle cursor trail effect"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="font-sans text-sm font-semibold uppercase tracking-wide">
                Sound
              </span>
              <Toggle
                checked={sound.enabled}
                onChange={sound.setEnabled}
                label="Toggle sound effects"
              />
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="retro-controls-panel"
        aria-label="System display and sound settings"
        className="flex h-11 w-11 items-center justify-center neo-border-thick bg-surface text-foreground shadow-[4px_4px_0_0_var(--color-border)] transition-colors hover:bg-surface-raised focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
      >
        <MonitorCog className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
