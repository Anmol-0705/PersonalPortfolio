import type { Project } from "@/types/project";

/**
 * Single source of truth for project content. Homepage, /projects, and
 * /projects/[slug] all read through lib/projects.ts, which reads this file.
 *
 * Content integrity: only technologies, descriptions, and details actually
 * provided are recorded here. Where the exact stack wasn't confirmed,
 * `technologies` is left as an empty array rather than guessed — UI
 * components must treat an empty array as "not shown", not as an error.
 * No client names, URLs, metrics, or testimonials are invented.
 */
export const projects: Project[] = [
  {
    slug: "the-creation-edit",
    title: "The-Creation-Edit",
    category: "Agency Website",
    shortDescription:
      "A visually engaging website for a video editing agency built with React, Tailwind CSS, and Framer Motion.",
    overview:
      "The-Creation-Edit is a website for a video editing agency, built to give the studio a visually engaging online presence that reflects the quality of its editing work.",
    featured: true,
    order: 1,
    status: "completed",
    technologies: ["React", "Tailwind CSS", "Framer Motion"],
    problem:
      "Video editing agencies often rely on scattered portfolio links and social media to showcase their work, which makes it harder for potential clients to get a clear, consistent first impression.",
    approach:
      "The site was built around a clean, motion-forward design using React, Tailwind CSS, and Framer Motion, so the agency's editing style could be reflected in the way the website itself moves and responds.",
    solution:
      "The result is a single, cohesive website that presents the agency's services and work in a visually engaging way, giving visitors a consistent brand experience.",
    keyFeatures: [
      "Motion-driven visual design",
      "Responsive layout across devices",
      "Built with React, Tailwind CSS, and Framer Motion",
    ],
  },
  {
    slug: "electrotrans-solutions",
    title: "ElectroTrans Solutions",
    category: "Industrial B2B Website",
    shortDescription:
      "An industrial B2B website created for a transformer manufacturer, focused on presenting technical services and business capabilities clearly.",
    overview:
      "ElectroTrans Solutions is an industrial B2B website built for a transformer manufacturer to present its technical services and business capabilities online.",
    featured: true,
    order: 2,
    status: "completed",
    technologies: [],
    problem:
      "Industrial and manufacturing businesses often need to communicate technical services and capabilities clearly to other businesses, which is a different challenge from a typical consumer-facing website.",
    approach:
      "The site was designed around presenting technical service information and business capabilities in a clear, organized format suited to a B2B industrial audience.",
    solution:
      "The result is a business website that communicates ElectroTrans Solutions' technical services and capabilities clearly to potential B2B clients.",
    keyFeatures: [
      "Clear presentation of technical services",
      "Business-capability focused structure",
      "Built for a B2B industrial audience",
    ],
  },
  {
    slug: "sundown-studios",
    title: "Sundown Studios",
    category: "Creative / Interior Design Website",
    shortDescription:
      "A sleek interior design experience featuring smooth interactions and a dynamic visual gallery.",
    overview:
      "Sundown Studios is a creative website for an interior design brand, built to present its work through a sleek, interactive visual gallery.",
    featured: true,
    order: 3,
    status: "completed",
    technologies: [],
    problem:
      "Interior design work is highly visual, so a design brand needs a website that can showcase projects in a way that feels as considered as the design work itself.",
    approach:
      "The site focuses on smooth interactions and a dynamic visual gallery to let the design work take center stage.",
    solution:
      "The result is a sleek, interaction-driven experience that presents Sundown Studios' interior design work through an engaging visual gallery.",
    keyFeatures: [
      "Dynamic visual gallery",
      "Smooth, considered interactions",
      "Design-forward presentation",
    ],
  },
  {
    slug: "property-dealer-web-app",
    title: "Property Dealer Web App",
    category: "Real Estate Web Application",
    shortDescription:
      "A real estate platform built with React, Node.js, and PostgreSQL for managing and exploring property listings.",
    overview:
      "A real estate platform built to help manage and explore property listings, with a full-stack architecture spanning frontend, backend, and database layers.",
    featured: false,
    order: 4,
    status: "completed",
    technologies: ["React", "Node.js", "PostgreSQL"],
    problem:
      "Managing and exploring property listings requires both a usable public-facing interface and reliable backend data handling, rather than just a static marketing site.",
    approach:
      "The application was built with a React frontend, a Node.js backend, and a PostgreSQL database to support structured property data and listing management.",
    solution:
      "The result is a real estate web application for managing and exploring property listings, built on a full-stack architecture.",
    keyFeatures: [
      "Property listing management",
      "React frontend with a Node.js backend",
      "PostgreSQL-backed data layer",
    ],
  },
  {
    slug: "teaching-institute-portal",
    title: "Teaching Institute Portal",
    category: "EdTech Platform",
    shortDescription:
      "An EdTech platform designed to support teaching, learning, and institute operations.",
    overview:
      "An EdTech platform designed to support teaching, learning, and day-to-day institute operations.",
    featured: false,
    order: 5,
    status: "completed",
    technologies: [],
    problem:
      "Teaching institutes often need to support several functions — teaching, learning, and operations — that are hard to manage without a dedicated digital platform.",
    approach:
      "The portal was designed to bring teaching, learning, and institute operations together in a single platform.",
    solution:
      "The result is an EdTech portal that supports the institute's teaching, learning, and operational needs.",
    keyFeatures: [
      "Support for teaching and learning workflows",
      "Institute operations support",
      "Unified platform structure",
    ],
  },
];
