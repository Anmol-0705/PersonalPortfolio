export type EngagementType = "quick-sprint" | "full-build";

export type SprintWorkType =
  | "bug-fix"
  | "ui-ux-improvement"
  | "new-feature"
  | "performance-improvement"
  | "code-architecture-review"
  | "other";

export type SprintScope =
  | "up-to-1-hour"
  | "1-to-2-hours"
  | "2-to-3-hours"
  | "3-to-5-hours"
  | "full-5-hour-sprint";

export type QuickSprintRequest = {
  workType: SprintWorkType;
  scope: SprintScope;
  description?: string;
};

export type ProjectType =
  | "landing-page"
  | "business-website"
  | "portfolio-website"
  | "web-application"
  | "saas-product"
  | "dashboard"
  | "custom-project";

export type ProjectComplexity = "simple" | "moderate" | "advanced";

export type ProjectTimeline =
  | "flexible"
  | "2-to-4-weeks"
  | "1-to-2-weeks"
  | "urgent-asap";

export type ProjectRequirement =
  | "ui-ux-design"
  | "responsive-design"
  | "authentication"
  | "backend-api"
  | "database"
  | "admin-dashboard"
  | "third-party-integration"
  | "deployment"
  | "performance-optimization";

export type ProjectRequest = {
  projectType: ProjectType;
  complexity: ProjectComplexity;
  timeline: ProjectTimeline;
  requirements: ProjectRequirement[];
};

export type EngagementLevel =
  | "focused-build"
  | "standard-build"
  | "advanced-build";

export type QuoteEstimate = {
  /** Only meaningful for full-build requests. */
  level?: EngagementLevel;
  headline: string;
  message: string;
  /** Quick-sprint only. Always explicitly labelled as indicative in the UI. */
  indicativeEstimate?: string;
};

/**
 * Normalized bundle handed from the engagement flow to the quote modal.
 * Exactly one of `quickSprint` / `project` is set, matching `engagementType`.
 */
export type QuoteContext = {
  engagementType: EngagementType;
  quickSprint?: QuickSprintRequest;
  project?: ProjectRequest;
  estimate: QuoteEstimate;
};
