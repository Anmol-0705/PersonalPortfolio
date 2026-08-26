"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { X } from "lucide-react";
import { TechBadge } from "@/components/ui/tech-badge";

export type TechChipInputProps = {
  technologies: string[];
  onChange: (technologies: string[]) => void;
};

export function TechChipInput({ technologies, onChange }: TechChipInputProps) {
  const [draft, setDraft] = useState("");

  function addTech() {
    const value = draft.trim();
    if (!value || technologies.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...technologies, value]);
    setDraft("");
  }

  function removeTech(tech: string) {
    onChange(technologies.filter((item) => item !== tech));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTech();
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <TechBadge key={tech} variant="yellow" className="text-sm">
              {tech}
              <button
                type="button"
                onClick={() => removeTech(tech)}
                aria-label={`Remove ${tech}`}
                className="ml-2 inline-flex"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </TechBadge>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. React"
          aria-label="Add a technology"
          className="flex-1 neo-border bg-background px-3 py-2 font-sans text-sm focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
        />
        <button
          type="button"
          onClick={addTech}
          className="neo-border bg-surface-raised px-4 py-2 font-sans text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-surface focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
