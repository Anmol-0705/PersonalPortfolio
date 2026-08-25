"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { QuickSprintCalculator } from "@/components/engagement/quick-sprint-calculator";
import { ProjectEstimator } from "@/components/engagement/project-estimator";
import { QuickQuoteModal } from "@/components/contact/quick-quote-modal";
import { cn } from "@/lib/utils";
import type { EngagementType, QuoteContext } from "@/types/quote";

const TABS: { id: EngagementType; label: string }[] = [
  { id: "quick-sprint", label: "Quick Sprint" },
  { id: "full-build", label: "Full Build" },
];

export type EngagementSelectorProps = {
  initialType?: EngagementType;
};

export function EngagementSelector({
  initialType = "quick-sprint",
}: EngagementSelectorProps) {
  const [activeType, setActiveType] = useState<EngagementType>(initialType);
  const [quoteContext, setQuoteContext] = useState<QuoteContext | null>(null);
  const tabRefs = useRef<Partial<Record<EngagementType, HTMLButtonElement>>>({});

  function focusAndActivate(type: EngagementType) {
    setActiveType(type);
    tabRefs.current[type]?.focus();
  }

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const currentIndex = TABS.findIndex((tab) => tab.id === activeType);
    const nextIndex =
      event.key === "ArrowRight"
        ? (currentIndex + 1) % TABS.length
        : (currentIndex - 1 + TABS.length) % TABS.length;
    focusAndActivate(TABS[nextIndex].id);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div>
        <div
          role="tablist"
          aria-label="Engagement model"
          className="inline-flex neo-border-thick bg-surface"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={`engagement-tab-${tab.id}`}
              aria-selected={activeType === tab.id}
              aria-controls={`engagement-panel-${tab.id}`}
              tabIndex={activeType === tab.id ? 0 : -1}
              onClick={() => setActiveType(tab.id)}
              onKeyDown={handleTabKeyDown}
              className={cn(
                "px-5 py-2.5 font-sans text-sm font-semibold uppercase tracking-wide transition-colors focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2",
                activeType === tab.id
                  ? "bg-accent text-off-white"
                  : "text-foreground hover:bg-surface-raised",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`engagement-panel-${activeType}`}
          aria-labelledby={`engagement-tab-${activeType}`}
          className="mt-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeType}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeType === "quick-sprint" ? (
                <QuickSprintCalculator onRequestQuote={setQuoteContext} />
              ) : (
                <ProjectEstimator onRequestQuote={setQuoteContext} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <QuickQuoteModal
          context={quoteContext}
          onClose={() => setQuoteContext(null)}
        />
      </div>
    </MotionConfig>
  );
}
