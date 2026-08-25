import type {
  EngagementLevel,
  ProjectComplexity,
  ProjectRequest,
  ProjectRequirement,
  ProjectTimeline,
  ProjectType,
  QuickSprintRequest,
  QuoteEstimate,
  SprintScope,
  SprintWorkType,
} from "@/types/quote";

/**
 * Deterministic, transparent estimation logic for the engagement flow.
 * Nothing here produces a binding price — only honest guidance and an
 * explicitly-labelled indicative figure derived from the public sprint
 * package. Kept out of components so it stays simple to reason about
 * (and unit-test, if tests are added later).
 */

// ---------------------------------------------------------------------
// Labels (shared between the selection UI and the quote summary so the
// two never drift apart)
// ---------------------------------------------------------------------

export const SPRINT_WORK_TYPE_LABELS: Record<SprintWorkType, string> = {
  "bug-fix": "Bug Fix",
  "ui-ux-improvement": "UI / UX Improvement",
  "new-feature": "New Feature",
  "performance-improvement": "Performance Improvement",
  "code-architecture-review": "Code / Architecture Review",
  other: "Other",
};

export const SPRINT_SCOPE_LABELS: Record<SprintScope, string> = {
  "up-to-1-hour": "Up to 1 hour",
  "1-to-2-hours": "1 to 2 hours",
  "2-to-3-hours": "2 to 3 hours",
  "3-to-5-hours": "3 to 5 hours",
  "full-5-hour-sprint": "Full 5-hour sprint",
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  "landing-page": "Landing Page",
  "business-website": "Business Website",
  "portfolio-website": "Portfolio Website",
  "web-application": "Web Application",
  "saas-product": "SaaS Product",
  dashboard: "Dashboard",
  "custom-project": "Custom Project",
};

export const PROJECT_COMPLEXITY_LABELS: Record<
  ProjectComplexity,
  { label: string; description: string }
> = {
  simple: {
    label: "Simple",
    description: "Focused pages and standard functionality.",
  },
  moderate: {
    label: "Moderate",
    description: "Multiple pages, custom interactions, and integrations.",
  },
  advanced: {
    label: "Advanced",
    description:
      "Complex functionality, multiple systems, or substantial backend requirements.",
  },
};

export const PROJECT_TIMELINE_LABELS: Record<ProjectTimeline, string> = {
  flexible: "Flexible",
  "2-to-4-weeks": "Within 2 to 4 weeks",
  "1-to-2-weeks": "Within 1 to 2 weeks",
  "urgent-asap": "Urgent / ASAP",
};

export const PROJECT_REQUIREMENT_LABELS: Record<ProjectRequirement, string> = {
  "ui-ux-design": "UI/UX Design",
  "responsive-design": "Responsive Design",
  authentication: "Authentication",
  "backend-api": "Backend/API",
  database: "Database",
  "admin-dashboard": "Admin Dashboard",
  "third-party-integration": "Third-Party Integration",
  deployment: "Deployment",
  "performance-optimization": "Performance Optimization",
};

export const ENGAGEMENT_LEVEL_LABELS: Record<EngagementLevel, string> = {
  "focused-build": "Focused Build",
  "standard-build": "Standard Build",
  "advanced-build": "Advanced Build",
};

// ---------------------------------------------------------------------
// Quick Sprint
// ---------------------------------------------------------------------

/** Hour range each scope option represents, for the indicative estimate only. */
const SPRINT_HOUR_RANGES: Record<SprintScope, [number, number]> = {
  "up-to-1-hour": [0, 1],
  "1-to-2-hours": [1, 2],
  "2-to-3-hours": [2, 3],
  "3-to-5-hours": [3, 5],
  "full-5-hour-sprint": [5, 5],
};

/** Rate implied by the public ₹2000 / 5-hour package — never shown as a standalone "hourly rate". */
const SPRINT_PACKAGE_RATE_PER_HOUR = 2000 / 5;

/** Scopes at or beyond the package's capacity — these may need more than one sprint. */
const SCOPES_AT_CAPACITY: SprintScope[] = ["3-to-5-hours", "full-5-hour-sprint"];

export function estimateQuickSprint(request: QuickSprintRequest): QuoteEstimate {
  const [low, high] = SPRINT_HOUR_RANGES[request.scope];
  const indicativeLow = Math.round(low * SPRINT_PACKAGE_RATE_PER_HOUR);
  const indicativeHigh = Math.round(high * SPRINT_PACKAGE_RATE_PER_HOUR);
  const indicativeAmount =
    indicativeLow === indicativeHigh
      ? `₹${indicativeHigh}`
      : `₹${indicativeLow}–₹${indicativeHigh}`;

  const atCapacity = SCOPES_AT_CAPACITY.includes(request.scope);

  return {
    headline: atCapacity
      ? "This may require more than one sprint."
      : "Your task appears suitable for a focused sprint.",
    message: atCapacity
      ? "Let's discuss the scope to plan sprint coverage."
      : "Final scope will be confirmed before work begins.",
    indicativeEstimate: `Indicative estimate: ${indicativeAmount} (based on the ₹2000 / 5-hour sprint package, not a separate hourly rate)`,
  };
}

export function summarizeQuickSprint(request: QuickSprintRequest): string[] {
  const lines = [
    `Work type: ${SPRINT_WORK_TYPE_LABELS[request.workType]}`,
    `Scope: ${SPRINT_SCOPE_LABELS[request.scope]}`,
  ];
  if (request.description) {
    lines.push(`Task details: ${request.description}`);
  }
  return lines;
}

// ---------------------------------------------------------------------
// Full Build
// ---------------------------------------------------------------------

const COMPLEXITY_SCORE: Record<ProjectComplexity, number> = {
  simple: 1,
  moderate: 2,
  advanced: 3,
};

const PROJECT_TYPE_SCORE: Record<ProjectType, number> = {
  "landing-page": 1,
  "portfolio-website": 1,
  "business-website": 2,
  dashboard: 2,
  "custom-project": 2,
  "web-application": 3,
  "saas-product": 3,
};

const LEVEL_COPY: Record<EngagementLevel, string> = {
  "focused-build": "Likely a focused build with a smaller project scope.",
  "standard-build": "Likely requires a multi-feature development cycle.",
  "advanced-build":
    "Likely requires detailed planning and a custom technical architecture.",
};

function scoreProject(request: ProjectRequest): number {
  const complexityScore = COMPLEXITY_SCORE[request.complexity];
  const typeScore = PROJECT_TYPE_SCORE[request.projectType];
  const requirementsScore = request.requirements.length;
  const urgencyBump = request.timeline === "urgent-asap" ? 1 : 0;

  return complexityScore + typeScore + requirementsScore + urgencyBump;
}

function levelFromScore(score: number): EngagementLevel {
  if (score <= 4) return "focused-build";
  if (score <= 9) return "standard-build";
  return "advanced-build";
}

export function estimateProject(request: ProjectRequest): QuoteEstimate {
  const level = levelFromScore(scoreProject(request));

  return {
    level,
    headline: `This looks like a ${ENGAGEMENT_LEVEL_LABELS[level]}.`,
    message: `${LEVEL_COPY[level]} Share your requirements to receive a custom proposal.`,
  };
}

export function summarizeProject(request: ProjectRequest): string[] {
  return [
    `Project type: ${PROJECT_TYPE_LABELS[request.projectType]}`,
    `Complexity: ${PROJECT_COMPLEXITY_LABELS[request.complexity].label}`,
    `Timeline: ${PROJECT_TIMELINE_LABELS[request.timeline]}`,
    request.requirements.length > 0
      ? `Requirements: ${request.requirements
          .map((requirement) => PROJECT_REQUIREMENT_LABELS[requirement])
          .join(", ")}`
      : "Requirements: None selected",
  ];
}
