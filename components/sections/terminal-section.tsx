"use client";

import { useState } from "react";
import { TerminalSquare } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Terminal } from "@/components/terminal/terminal";
import { neoButtonClasses } from "@/components/ui/neo-button";
import type { Project } from "@/types/project";
import type { Service } from "@/types/service";
import type { SkillGroup } from "@/types/skill";

export type TerminalSectionProps = {
  projects: Project[];
  skillGroups: SkillGroup[];
  services: Service[];
};

export function TerminalSection({ projects, skillGroups, services }: TerminalSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="border-b-[3px] border-border bg-surface">
      <div className="container-app flex flex-col items-center gap-4 py-16 text-center sm:py-20">
        <TerminalSquare className="h-8 w-8 text-crt-green" aria-hidden="true" />
        <h2 className="font-sans text-2xl font-bold sm:text-3xl">
          Prefer the command line?
        </h2>
        <p className="max-w-md font-sans text-muted">
          Explore my work without leaving the keyboard.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={neoButtonClasses("secondary", "mt-2")}
        >
          Open Terminal
        </button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="terminal.exe"
        className="max-w-2xl!"
      >
        <Terminal projects={projects} skillGroups={skillGroups} services={services} />
      </Modal>
    </section>
  );
}
