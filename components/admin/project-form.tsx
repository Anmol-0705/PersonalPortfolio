"use client";

import { useState, useTransition } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { Toggle } from "@/components/ui/toggle";
import { TechChipInput } from "@/components/admin/tech-chip-input";
import { ProjectImageUpload } from "@/components/admin/project-image-upload";
import { slugify } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { uploadProjectImage } from "@/lib/supabase/storage";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import {
  createProject,
  updateProject,
  updateProjectCoverImage,
} from "@/lib/admin/project-actions";
import type { ProjectFormInput } from "@/lib/admin/project-actions";
import type { Project } from "@/types/project";

export type ProjectFormProps =
  | { mode: "create"; project?: undefined }
  | { mode: "edit"; project: Project };

function toFormState(project?: Project): ProjectFormInput {
  return {
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    category: project?.category ?? "",
    shortDescription: project?.shortDescription ?? "",
    problem: project?.problem ?? "",
    approach: project?.approach ?? "",
    solution: project?.solution ?? "",
    technologies: project?.technologies ?? [],
    featured: project?.featured ?? false,
    published: project?.published ?? false,
    liveUrl: project?.liveUrl ?? "",
    githubUrl: project?.githubUrl ?? "",
    testimonialQuote: project?.testimonial?.quote ?? "",
    testimonialAuthor: project?.testimonial?.author ?? "",
  };
}

const PROJECTS_LIST_HREF = "/admin/projects";

export function ProjectForm({ mode, project }: ProjectFormProps) {
  const router = useRouter();
  const [initialForm] = useState<ProjectFormInput>(() => toFormState(project));
  const [form, setForm] = useState<ProjectFormInput>(initialForm);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [error, setError] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    project?.media?.coverImage ?? null,
  );
  const [stagedImageFile, setStagedImageFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  // coverImageUrl is deliberately excluded: in edit mode it only
  // changes via ProjectImageUpload's own immediate, already-persisted
  // save, so it must never trigger an "unsaved changes" warning for
  // this form. A staged (not-yet-uploaded) file in create mode is a
  // real unsaved change, though — losing the selection is real data loss.
  const isDirty =
    !justSaved &&
    (JSON.stringify(form) !== JSON.stringify(initialForm) || stagedImageFile !== null);
  useUnsavedChangesWarning(isDirty);

  function updateField<K extends keyof ProjectFormInput>(
    key: K,
    value: ProjectFormInput[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function handleTitleChange(value: string) {
    updateField("title", value);
    if (!slugTouched) {
      updateField("slug", slugify(value));
    }
  }

  function handleCancel() {
    if (isDirty && !window.confirm("You have unsaved changes. Leave without saving?")) {
      return;
    }
    router.push(PROJECTS_LIST_HREF);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createProject(form)
          : await updateProject(project.id, form);

      if (!result.success) {
        setError(result.error);
        return;
      }

      // Create mode only: the project didn't have an id until now, so a
      // picked cover image was staged locally rather than uploaded.
      // Upload it now against the real id. A failure here doesn't undo
      // project creation — it's reported distinctly so the admin knows
      // to retry the image from Edit rather than assuming nothing saved.
      if (mode === "create" && stagedImageFile) {
        const supabase = createClient();
        const uploadResult = await uploadProjectImage(
          supabase,
          result.id,
          stagedImageFile,
        );

        if (!uploadResult.success) {
          setError(
            `Project created, but the image failed to upload: ${uploadResult.message}. You can add it from Edit.`,
          );
          return;
        }

        const saveResult = await updateProjectCoverImage(
          result.id,
          uploadResult.publicUrl,
        );
        if (!saveResult.success) {
          setError(
            `Project created and image uploaded, but saving it failed: ${saveResult.error}. You can add it from Edit.`,
          );
          return;
        }
      }

      setJustSaved(true);
      router.push(PROJECTS_LIST_HREF);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <NeoCard className="flex flex-col gap-4">
        <Field label="Title" htmlFor="title">
          <input
            id="title"
            required
            value={form.title}
            onChange={(event) => handleTitleChange(event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Slug" htmlFor="slug">
          <input
            id="slug"
            required
            value={form.slug}
            onChange={(event) => {
              setSlugTouched(true);
              updateField("slug", event.target.value);
            }}
            className={inputClass}
          />
        </Field>

        <Field label="Category" htmlFor="category">
          <input
            id="category"
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Short Description" htmlFor="shortDescription">
          <textarea
            id="shortDescription"
            required
            rows={2}
            value={form.shortDescription}
            onChange={(event) => updateField("shortDescription", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Cover Image" htmlFor="coverImage">
          <ProjectImageUpload
            projectId={mode === "edit" ? project.id : null}
            value={coverImageUrl}
            onChange={setCoverImageUrl}
            onStagedFileChange={setStagedImageFile}
          />
        </Field>
      </NeoCard>

      <NeoCard className="flex flex-col gap-4">
        <Field label="Problem" htmlFor="problem">
          <textarea
            id="problem"
            rows={3}
            value={form.problem}
            onChange={(event) => updateField("problem", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Approach" htmlFor="approach">
          <textarea
            id="approach"
            rows={3}
            value={form.approach}
            onChange={(event) => updateField("approach", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Solution" htmlFor="solution">
          <textarea
            id="solution"
            rows={3}
            value={form.solution}
            onChange={(event) => updateField("solution", event.target.value)}
            className={inputClass}
          />
        </Field>
      </NeoCard>

      <NeoCard className="flex flex-col gap-4">
        <Field label="Technologies" htmlFor="technologies">
          <TechChipInput
            technologies={form.technologies}
            onChange={(technologies) => updateField("technologies", technologies)}
          />
        </Field>

        <Field label="Live URL (optional)" htmlFor="liveUrl">
          <input
            id="liveUrl"
            type="url"
            value={form.liveUrl}
            onChange={(event) => updateField("liveUrl", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="GitHub URL (optional)" htmlFor="githubUrl">
          <input
            id="githubUrl"
            type="url"
            value={form.githubUrl}
            onChange={(event) => updateField("githubUrl", event.target.value)}
            className={inputClass}
          />
        </Field>
      </NeoCard>

      <NeoCard className="flex flex-col gap-4">
        <Field label="Testimonial Quote (optional)" htmlFor="testimonialQuote">
          <textarea
            id="testimonialQuote"
            rows={2}
            value={form.testimonialQuote}
            onChange={(event) => updateField("testimonialQuote", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Testimonial Author (optional)" htmlFor="testimonialAuthor">
          <input
            id="testimonialAuthor"
            value={form.testimonialAuthor}
            onChange={(event) => updateField("testimonialAuthor", event.target.value)}
            className={inputClass}
          />
        </Field>
      </NeoCard>

      <NeoCard className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Toggle
          checked={form.featured}
          onChange={(checked) => updateField("featured", checked)}
          label="Featured"
          showLabel
        />
        <Toggle
          checked={form.published}
          onChange={(checked) => updateField("published", checked)}
          label="Published"
          showLabel
        />
      </NeoCard>

      {error && (
        <p role="alert" className="font-sans text-sm text-hot-pink">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className={neoButtonClasses("primary")}
        >
          {isPending ? "Saving..." : mode === "create" ? "Create Project" : "Save Changes"}
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
