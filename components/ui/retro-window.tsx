import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RetroWindowProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  /** Visual-only window controls. Not wired to any behavior. */
  showControls?: boolean;
  contentClassName?: string;
  children: ReactNode;
};

export function RetroWindow({
  title,
  showControls = true,
  className,
  contentClassName,
  children,
  ...props
}: RetroWindowProps) {
  return (
    <section
      role="group"
      aria-label={title}
      className={cn("neo-border-thick neo-shadow bg-surface", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-3 border-b-[3px] border-border bg-off-white px-3 py-2 text-pure-black sm:px-4">
        <span className="truncate font-retro text-lg leading-none sm:text-xl">
          {title}
        </span>

        {showControls && (
          <div aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border-2 border-pure-black bg-cyber-yellow" />
            <span className="h-3 w-3 rounded-full border-2 border-pure-black bg-crt-green" />
            <span className="h-3 w-3 rounded-full border-2 border-pure-black bg-hot-pink" />
          </div>
        )}
      </div>

      <div className={cn("p-6 sm:p-8", contentClassName)}>{children}</div>
    </section>
  );
}
