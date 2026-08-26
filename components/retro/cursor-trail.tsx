"use client";

import { useEffect, useRef } from "react";
import { useCursorTrail } from "@/hooks/use-cursor-trail";

const TRAIL_LENGTH = 6;
const TRAIL_COLORS = [
  "var(--color-pixel-purple)",
  "var(--color-electric-blue)",
  "var(--color-crt-green)",
  "var(--color-cyber-yellow)",
  "var(--color-hot-pink)",
  "var(--color-pixel-purple)",
];

/**
 * Renders a small fixed pool of trailing dots that follow the pointer.
 * Positions are updated via direct DOM style writes inside a
 * requestAnimationFrame loop — not React state — so a mousemove never
 * triggers a re-render. Only initializes when the pointer is fine (not
 * touch) and the user hasn't asked for reduced motion; both are checked
 * once when the effect runs (on enable), not tracked live.
 */
export function CursorTrail() {
  const [enabled] = useCursorTrail();
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: -100, y: -100 });
  const positionsRef = useRef(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 })),
  );

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (prefersReducedMotion || !hasFinePointer) return;

    function handlePointerMove(event: PointerEvent) {
      pointerRef.current = { x: event.clientX, y: event.clientY };
    }

    window.addEventListener("pointermove", handlePointerMove);

    let frameId: number;
    function animate() {
      const dots = containerRef.current?.children;
      let target = pointerRef.current;

      positionsRef.current.forEach((position, index) => {
        position.x += (target.x - position.x) * 0.3;
        position.y += (target.y - position.y) * 0.3;
        target = position;

        const dot = dots?.[index] as HTMLElement | undefined;
        if (dot) {
          dot.style.transform = `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`;
        }
      });

      frameId = requestAnimationFrame(animate);
    }
    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(frameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30"
    >
      {TRAIL_COLORS.map((color, index) => (
        <span
          key={index}
          className="absolute top-0 left-0 h-2 w-2"
          style={{
            backgroundColor: color,
            opacity: 1 - index / TRAIL_LENGTH,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
