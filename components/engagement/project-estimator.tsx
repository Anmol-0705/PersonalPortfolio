"use client";

import { useMemo, useState } from "react";
import { OptionChip } from "@/components/engagement/option-chip";
import { neoButtonClasses } from "@/components/ui/neo-button";
import {
  PROJECT_COMPLEXITY_LABELS,
  PROJECT_REQUIREMENT_LABELS,
  PROJECT_TIMELINE_LABELS,
  PROJECT_TYPE_LABELS,
  estimateProject,
} from "@/lib/quote-estimator";
import type {
  ProjectComplexity,
  ProjectRequest,
  ProjectRequirement,
  ProjectTimeline,
  ProjectType,
  QuoteContext,
} from "@/types/quote";

const PROJECT_TYPES: ProjectType[] = [
  "landing-page",
  "business-website",
  "portfolio-website",
  "web-application",
  "saas-product",
  "dashboard",
  "custom-project",
];

const COMPLEXITIES: ProjectComplexity[] = ["simple", "moderate", "advanced"];

const TIMELINES: ProjectTimeline[] = [
  "flexible",
  "2-to-4-weeks",
  "1-to-2-weeks",
  "urgent-asap",
];

const REQUIREMENTS: ProjectRequirement[] = [
  "ui-ux-design",
  "responsive-design",
  "authentication",
  "backend-api",
  "database",
  "admin-dashboard",
  "third-party-integration",
  "deployment",
  "performance-optimization",
];

export type ProjectEstimatorProps = {
  onRequestQuote: (context: QuoteContext) => void;
};

export function ProjectEstimator({ onRequestQuote }: ProjectEstimatorProps) {
  const [projectType, setProjectType] = useState<ProjectType>("business-website");
  const [complexity, setComplexity] = useState<ProjectComplexity>("moderate");
  const [timeline, setTimeline] = useState<ProjectTimeline>("flexible");
  const [requirements, setRequirements] = useState<ProjectRequirement[]>([]);

  const request: ProjectRequest = useMemo(
    () => ({ projectType, complexity, timeline, requirements }),
    [projectType, complexity, timeline, requirements],
  );

  const estimate = useMemo(() => estimateProject(request), [request]);

  function toggleRequirement(requirement: ProjectRequirement) {
    setRequirements((current) =>
      current.includes(requirement)
        ? current.filter((item) => item !== requirement)
        : [...current, requirement],
    );
  }

  return (
    <div className="neo-border-thick bg-surface p-6 sm:p-8">
      <p className="font-retro text-lg text-accent-secondary">
        CUSTOM SCOPE + PRICING — FULL BUILD
      </p>

      <fieldset className="mt-6">
        <legend className="font-sans text-sm font-semibold uppercase tracking-wide">
          Project Type
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {PROJECT_TYPES.map((type) => (
            <OptionChip
              key={type}
              type="radio"
              name="project-type"
              value={type}
              checked={projectType === type}
              onChange={() => setProjectType(type)}
              label={PROJECT_TYPE_LABELS[type]}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="font-sans text-sm font-semibold uppercase tracking-wide">
          Complexity
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {COMPLEXITIES.map((level) => (
            <OptionChip
              key={level}
              type="radio"
              name="project-complexity"
              value={level}
              checked={complexity === level}
              onChange={() => setComplexity(level)}
              label={PROJECT_COMPLEXITY_LABELS[level].label}
              description={PROJECT_COMPLEXITY_LABELS[level].description}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="font-sans text-sm font-semibold uppercase tracking-wide">
          Timeline
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TIMELINES.map((option) => (
            <OptionChip
              key={option}
              type="radio"
              name="project-timeline"
              value={option}
              checked={timeline === option}
              onChange={() => setTimeline(option)}
              label={PROJECT_TIMELINE_LABELS[option]}
            />
          ))}
        </div>
        <p className="mt-2 font-sans text-xs text-muted">
          Timeline is a starting point for discussion, not a delivery
          guarantee.
        </p>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="font-sans text-sm font-semibold uppercase tracking-wide">
          Requirements{" "}
          <span className="text-muted normal-case">
            (select all that apply)
          </span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {REQUIREMENTS.map((requirement) => (
            <OptionChip
              key={requirement}
              type="checkbox"
              value={requirement}
              checked={requirements.includes(requirement)}
              onChange={() => toggleRequirement(requirement)}
              label={PROJECT_REQUIREMENT_LABELS[requirement]}
            />
          ))}
        </div>
      </fieldset>

      <div
        role="status"
        className="mt-6 neo-border bg-background p-4"
        aria-live="polite"
      >
        <p className="font-sans font-semibold">{estimate.headline}</p>
        <p className="mt-1 font-sans text-sm text-muted">{estimate.message}</p>
      </div>

      <button
        type="button"
        onClick={() =>
          onRequestQuote({
            engagementType: "full-build",
            project: request,
            estimate,
          })
        }
        className={neoButtonClasses("primary", "mt-6 w-full sm:w-auto")}
      >
        Request a Custom Quote
      </button>
    </div>
  );
}
