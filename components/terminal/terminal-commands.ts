import type { Project } from "@/types/project";
import type { Service } from "@/types/service";
import type { SkillGroup } from "@/types/skill";
import type { SocialLink } from "@/types/social-link";
import { siteConfig } from "@/data/site-config";
import { socialLinkHref } from "@/lib/social-link-href";

export type TerminalTone = "default" | "muted" | "accent" | "error";

export type TerminalOutputLine = {
  text: string;
  tone?: TerminalTone;
  /** If set, rendered as a link — internal paths use next/link, others a plain anchor. */
  href?: string;
};

export type TerminalCommandResult =
  | { action: "print"; lines: TerminalOutputLine[] }
  | { action: "clear" }
  | { action: "navigate"; href: string; lines?: TerminalOutputLine[] };

export type TerminalCommandContext = {
  projects: Project[];
  skillGroups: SkillGroup[];
  services: Service[];
  socialLinks: SocialLink[];
};

export type TerminalCommand = {
  name: string;
  aliases: string[];
  description: string;
  /** Left out of `help` — used for easter eggs. */
  hidden?: boolean;
  run: (args: string[], context: TerminalCommandContext) => TerminalCommandResult;
};

function print(lines: TerminalOutputLine[]): TerminalCommandResult {
  return { action: "print", lines };
}

function line(
  text: string,
  tone?: TerminalTone,
  href?: string,
): TerminalOutputLine {
  return { text, tone, href };
}

const helpCommand: TerminalCommand = {
  name: "help",
  aliases: [],
  description: "Show available commands",
  run: () =>
    print([
      line("AVAILABLE COMMANDS", "accent"),
      ...terminalCommands
        .filter((command) => !command.hidden)
        .map((command) => {
          const aliasSuffix = command.aliases.length
            ? `  (alias: ${command.aliases.join(", ")})`
            : "";
          return line(`${command.name.padEnd(10)} ${command.description}${aliasSuffix}`);
        }),
    ]),
};

const aboutCommand: TerminalCommand = {
  name: "about",
  aliases: ["whoami"],
  description: "About Anmol",
  run: () =>
    print([
      line(siteConfig.name, "accent"),
      line(siteConfig.role),
      line(
        `${siteConfig.experience} experience · ${siteConfig.projectsDelivered} projects delivered`,
      ),
      line(`${siteConfig.location} · ${siteConfig.availability}`),
    ]),
};

const skillsCommand: TerminalCommand = {
  name: "skills",
  aliases: [],
  description: "View the tech stack",
  run: (_args, { skillGroups }) => {
    if (skillGroups.length === 0) {
      return print([line("No skills listed yet.", "muted")]);
    }
    return print(
      skillGroups.flatMap((group) => [
        line(group.label.toUpperCase(), "accent"),
        line(group.skills.join(", ")),
      ]),
    );
  },
};

const projectsCommand: TerminalCommand = {
  name: "projects",
  aliases: [],
  description: 'View portfolio projects (try "projects <slug>")',
  run: (args, { projects }) => {
    const slug = args[0];

    if (slug) {
      const project = projects.find((item) => item.slug === slug);
      if (!project) {
        return print([
          line(`No project found for "${slug}".`, "error"),
          line('Type "projects" to see all slugs.', "muted"),
        ]);
      }
      return {
        action: "navigate",
        href: `/projects/${project.slug}`,
        lines: [line(`Opening ${project.title}...`, "accent")],
      };
    }

    return print([
      line("PORTFOLIO PROJECTS", "accent"),
      ...projects.map((project, index) =>
        line(
          `${index + 1}. ${project.title} — ${project.category}`,
          "default",
          `/projects/${project.slug}`,
        ),
      ),
      line('Select an entry, or type "projects <slug>" to open one.', "muted"),
    ]);
  },
};

const servicesCommand: TerminalCommand = {
  name: "services",
  aliases: ["work"],
  description: "View services offered",
  run: (_args, { services }) => {
    if (services.length === 0) {
      return print([line("No services listed yet.", "muted")]);
    }
    return print([
      line("SERVICES", "accent"),
      ...services.map((service, index) =>
        line(`${`SVC_${String(index + 1).padStart(2, "0")}`}  ${service.title}`),
      ),
      line("Full descriptions →", "muted", "/services"),
    ]);
  },
};

const socialsCommand: TerminalCommand = {
  name: "socials",
  aliases: ["social", "connect"],
  description: "List ways to connect",
  run: (_args, { socialLinks }) => {
    // Defense in depth: context.socialLinks is already enabled-only
    // (threaded from getEnabledSocialLinks() in app/page.tsx), but the
    // terminal must never surface a disabled link under any
    // circumstance, so this filters again rather than trusting the
    // caller.
    const enabled = socialLinks.filter((link) => link.enabled);

    if (enabled.length === 0) {
      return print([line("No connections listed yet.", "muted")]);
    }

    return print([
      line("AVAILABLE CONNECTIONS", "accent"),
      ...enabled.flatMap((socialLink, index) => {
        const { href } = socialLinkHref(socialLink);
        return [line(`[${index + 1}] ${socialLink.label}`, "default", href)];
      }),
    ]);
  },
};

const hireCommand: TerminalCommand = {
  name: "hire",
  aliases: [],
  description: "View engagement options",
  run: () =>
    print([
      line("QUICK SPRINT", "accent"),
      line(
        "₹2000 / up to 5 hours — bug fixes, implementation tasks, architecture analysis, targeted development work.",
      ),
      line("FULL BUILD", "accent"),
      line(
        "Custom quote — websites, web applications, SaaS products, custom development projects.",
      ),
      line("Configure a request →", "muted", "/#engagement"),
    ]),
};

const contactCommand: TerminalCommand = {
  name: "contact",
  aliases: ["email"],
  description: "Get in touch",
  run: () =>
    print([
      line(siteConfig.email, "accent", `mailto:${siteConfig.email}`),
      line(siteConfig.location),
      line(siteConfig.availability),
      line("Open the contact page →", "muted", "/contact"),
    ]),
};

const clearCommand: TerminalCommand = {
  name: "clear",
  aliases: ["cls"],
  description: "Clear the terminal",
  run: () => ({ action: "clear" }),
};

const homeCommand: TerminalCommand = {
  name: "home",
  aliases: [],
  description: "Go to the homepage",
  run: () => ({
    action: "navigate",
    href: "/",
    lines: [line("Opening home...", "accent")],
  }),
};

const themeCommand: TerminalCommand = {
  name: "theme",
  aliases: [],
  description: "Retro display preferences",
  run: () =>
    print([
      line("DISPLAY / FX", "accent"),
      line("CRT scanlines, cursor trail, and sound effects are available."),
      line(
        "Use the system settings control in the bottom-right corner to toggle them.",
        "muted",
      ),
    ]),
};

const dateCommand: TerminalCommand = {
  name: "date",
  aliases: [],
  description: "Show the current date and time",
  run: () => print([line(new Date().toString())]),
};

const sudoCommand: TerminalCommand = {
  name: "sudo",
  aliases: [],
  description: "???",
  hidden: true,
  run: (args) => {
    if (args[0]?.toLowerCase() === "hire") {
      return print([
        line("Permission granted. Let's build something useful.", "accent"),
        line('Type "hire" to see engagement options.', "muted"),
      ]);
    }
    return print([
      line("Nice try — this terminal doesn't run arbitrary commands.", "muted"),
    ]);
  },
};

export const terminalCommands: TerminalCommand[] = [
  helpCommand,
  aboutCommand,
  skillsCommand,
  projectsCommand,
  servicesCommand,
  socialsCommand,
  hireCommand,
  contactCommand,
  homeCommand,
  themeCommand,
  dateCommand,
  clearCommand,
  sudoCommand,
];

const commandLookup = new Map<string, TerminalCommand>();
for (const command of terminalCommands) {
  commandLookup.set(command.name, command);
  for (const alias of command.aliases) commandLookup.set(alias, command);
}

export function runTerminalCommand(
  input: string,
  context: TerminalCommandContext,
): TerminalCommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { action: "print", lines: [] };

  const [name, ...args] = trimmed.split(/\s+/);
  const command = commandLookup.get(name.toLowerCase());

  if (!command) {
    return print([
      line(`Command not recognized: "${name}"`, "error"),
      line('Type "help" to see available commands.', "muted"),
    ]);
  }

  return command.run(args, context);
}
