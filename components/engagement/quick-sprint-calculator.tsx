"use client";

import { useMemo, useState } from "react";
import { OptionChip } from "@/components/engagement/option-chip";
import { neoButtonClasses } from "@/components/ui/neo-button";
import {
  SPRINT_SCOPE_LABELS,
  SPRINT_WORK_TYPE_LABELS,
  estimateQuickSprint,
} from "@/lib/quote-estimator";
import type {
  QuickSprintRequest,
  QuoteContext,
  SprintScope,
  SprintWorkType,
} from "@/types/quote";

const WORK_TYPES: SprintWorkType[] = [
  "bug-fix",
  "ui-ux-improvement",
  "new-feature",
  "performance-improvement",
  "code-architecture-review",
  "other",
];

const SCOPES: SprintScope[] = [
  "up-to-1-hour",
  "1-to-2-hours",
  "2-to-3-hours",
  "3-to-5-hours",
  "full-5-hour-sprint",
];

export type QuickSprintCalculatorProps = {
  onRequestQuote: (context: QuoteContext) => void;
};

export function QuickSprintCalculator({
  onRequestQuote,
}: QuickSprintCalculatorProps) {
  const [workType, setWorkType] = useState<SprintWorkType>("bug-fix");
  const [scope, setScope] = useState<SprintScope>("2-to-3-hours");
  const [description, setDescription] = useState("");

  const request: QuickSprintRequest = useMemo(
    () => ({
      workType,
      scope,
      description: description.trim() || undefined,
    }),
    [workType, scope, description],
  );

  const estimate = useMemo(
    () => estimateQuickSprint({ workType, scope }),
    [workType, scope],
  );

  return (
    <div className="neo-border-thick bg-surface p-6 sm:p-8">
      <p className="font-retro text-lg text-accent-secondary">
        ₹2000 / 5 HOURS — QUICK SPRINT PACKAGE
      </p>

      <fieldset className="mt-6">
        <legend className="font-sans text-sm font-semibold uppercase tracking-wide">
          Type of Work
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {WORK_TYPES.map((type) => (
            <OptionChip
              key={type}
              type="radio"
              name="sprint-work-type"
              value={type}
              checked={workType === type}
              onChange={() => setWorkType(type)}
              label={SPRINT_WORK_TYPE_LABELS[type]}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="font-sans text-sm font-semibold uppercase tracking-wide">
          Approximate Scope
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {SCOPES.map((scopeOption) => (
            <OptionChip
              key={scopeOption}
              type="radio"
              name="sprint-scope"
              value={scopeOption}
              checked={scope === scopeOption}
              onChange={() => setScope(scopeOption)}
              label={SPRINT_SCOPE_LABELS[scopeOption]}
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <label
          htmlFor="sprint-description"
          className="font-sans text-sm font-semibold uppercase tracking-wide"
        >
          Task Description{" "}
          <span className="text-muted normal-case">(optional)</span>
        </label>
        <textarea
          id="sprint-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          placeholder="A quick summary of what you need done."
          className="mt-2 w-full neo-border bg-background px-3 py-2 font-sans focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
        />
      </div>

      <div
        role="status"
        className="mt-6 neo-border bg-background p-4"
        aria-live="polite"
      >
        <p className="font-sans font-semibold">{estimate.headline}</p>
        <p className="mt-1 font-sans text-sm text-muted">{estimate.message}</p>
        {estimate.indicativeEstimate && (
          <p className="mt-2 font-retro text-base text-accent-secondary">
            {estimate.indicativeEstimate}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() =>
          onRequestQuote({
            engagementType: "quick-sprint",
            quickSprint: request,
            estimate,
          })
        }
        className={neoButtonClasses("primary", "mt-6 w-full sm:w-auto")}
      >
        Discuss This Sprint
      </button>
    </div>
  );
}
