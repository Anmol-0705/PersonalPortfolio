export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type SiteConfig = {
  name: string;
  role: string;
  experience: string;
  projectsDelivered: string;
  location: string;
  availability: string;
  email: string;
  repository: string;
  nav: NavLink[];
  /** Populate as real profiles become available. Never invent URLs. */
  socials: SocialLink[];
};

export const siteConfig: SiteConfig = {
  name: "Anmol Kumar",
  role: "Full Stack Developer & UI/UX Specialist",
  experience: "3+ years",
  projectsDelivered: "20+",
  location: "Haryana, India",
  availability: "Open to Remote Worldwide",
  email: "anmolthakur2820@gmail.com",
  repository: "PersonalPortfolio",
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ],
  socials: [],
};
