"use client";

import { useState, useTransition } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { KNOWN_SKILL_CATEGORIES } from "@/lib/skill-categories";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import { createSkill, updateSkill } from "@/lib/admin/skill-actions";
import type { SkillFormInput } from "@/lib/admin/skill-actions";
import type { Skill } from "@/types/skill";

export type SkillFormProps =
  | { mode: "create"; skill?: undefined; nextSortOrder: number }
  | { mode: "edit"; skill: Skill; nextSortOrder?: undefined };

function toFormState(skill: Skill | undefined, nextSortOrder: number | undefined): SkillFormInput {
  return {
    name: skill?.name ?? "",
    category: skill?.category ?? "",
    sortOrder: skill?.order ?? nextSortOrder ?? 0,
  };
}

export function SkillForm({ mode, skill, nextSortOrder }: SkillFormProps) {
  const router = useRouter();
  const [initialForm] = useState<SkillFormInput>(() => toFormState(skill, nextSortOrder));
  const [form, setForm] = useState<SkillFormInput>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const isDirty = !justSaved && JSON.stringify(form) !== JSON.stringify(initialForm);
  useUnsavedChangesWarning(isDirty);

  function updateField<K extends keyof SkillFormInput>(key: K, value: SkillFormInput[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function handleCancel() {
    if (isDirty && !window.confirm("You have unsaved changes. Leave without saving?")) {
      return;
    }
    router.push("/admin/skills");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result =
        mode === "create" ? await createSkill(form) : await updateSkill(skill.id, form);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setJustSaved(true);
      router.push("/admin/skills");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <NeoCard className="flex flex-col gap-4">
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Category" htmlFor="category">
          <input
            id="category"
            required
            list="skill-categories"
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className={inputClass}
          />
          <datalist id="skill-categories">
            {KNOWN_SKILL_CATEGORIES.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </Field>

        <Field label="Sort Order" htmlFor="sortOrder">
          <input
            id="sortOrder"
            type="number"
            min={0}
            step={1}
            required
            value={form.sortOrder}
            onChange={(event) => updateField("sortOrder", Number(event.target.value))}
            className={inputClass}
          />
        </Field>
      </NeoCard>

      {error && (
        <p role="alert" className="font-sans text-sm text-hot-pink">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className={neoButtonClasses("primary")}>
          {isPending ? "Saving..." : mode === "create" ? "Add Skill" : "Save Changes"}
        </button>
        <button type="button" onClick={handleCancel} className={neoButtonClasses("secondary")}>
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full neo-border bg-background px-3 py-2 font-sans text-sm focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-retro text-lg leading-none">
        {label}
      </label>
      {children}
    </div>
  );
}
