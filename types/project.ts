export type ProjectStatus = "completed" | "in-progress" | "archived";

export type ProjectMedia = {
  /** Path under /public, e.g. "/projects/[slug]/cover.webp". */
  coverImage?: string;
  previewImage?: string;
  demoVideo?: string;
};

export type ProjectTestimonial = {
  quote: string;
  author: string;
  role?: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  /** Short summary used on cards and previews. */
  shortDescription: string;
  /** Longer summary used at the top of the case study. Falls back to shortDescription when absent. */
  overview?: string;
  featured: boolean;
  /** Manual display order, ascending. */
  order: number;
  status?: ProjectStatus;
  /**
   * Verified technologies only. Leave as an empty array when the exact
   * stack isn't confirmed — UI must omit the technologies section rather
   * than guess.
   */
  technologies: string[];
  media?: ProjectMedia;
  liveUrl?: string;
  githubUrl?: string;
  problem?: string;
  approach?: string;
  solution?: string;
  keyFeatures?: string[];
  /** Freeform caveats or context that don't fit another field. */
  projectNotes?: string;
  testimonial?: ProjectTestimonial;
};
