export type ProjectMedia = {
  /** Public URL for the project's cover image. */
  coverImage?: string;
};

export type ProjectTestimonial = {
  quote: string;
  author: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  /** Short summary used on cards and previews. */
  shortDescription: string;
  featured: boolean;
  published: boolean;
  /** Manual display order, ascending. */
  order: number;
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
  testimonial?: ProjectTestimonial;
  /** ISO timestamp — used for admin "recently updated" ordering only. */
  updatedAt: string;
};
