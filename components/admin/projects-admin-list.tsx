"use client";

import { useId, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { Modal } from "@/components/ui/modal";
import { ProjectThumbnail } from "@/components/admin/project-thumbnail";
import { MoveButtons } from "@/components/admin/move-buttons";
import { PublishedBadge, FeaturedBadge, ImageStatusBadge } from "@/components/admin/status-badges";
import { PublishToggleButton } from "@/components/admin/publish-toggle-button";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import {
  bulkDeleteProjects,
  bulkSetProjectsFeatured,
  bulkSetProjectsPublished,
  moveProject,
} from "@/lib/admin/project-actions";
import type { Project } from "@/types/project";

export type ProjectAdminRow = {
  project: Project;
  canMoveUp: boolean;
  canMoveDown: boolean;
};

type StatusFilter = "all" | "published" | "draft";
type FeaturedFilter = "all" | "featured" | "not-featured";

export function ProjectsAdminList({ rows }: { rows: ProjectAdminRow[] }) {
  const router = useRouter();
  const searchId = useId();
  const statusId = useId();
  const featuredId = useId();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);
  const [confirmingBulkDelete, setConfirmingBulkDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter(({ project }) => {
      if (query) {
        const haystack = `${project.title} ${project.slug} ${project.category}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (statusFilter === "published" && !project.published) return false;
      if (statusFilter === "draft" && project.published) return false;
      if (featuredFilter === "featured" && !project.featured) return false;
      if (featuredFilter === "not-featured" && project.featured) return false;
      return true;
    });
  }, [rows, search, statusFilter, featuredFilter]);

  const filtersActive = search.trim() !== "" || statusFilter !== "all" || featuredFilter !== "all";
  const selectedIds = Array.from(selected);
  const allFilteredSelected = filtered.length > 0 && filtered.every((row) => selected.has(row.project.id));

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setFeaturedFilter("all");
  }

  function toggleOne(id: string) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllFiltered() {
    setSelected((previous) => {
      if (allFilteredSelected) {
        const next = new Set(previous);
        for (const row of filtered) next.delete(row.project.id);
        return next;
      }
      const next = new Set(previous);
      for (const row of filtered) next.add(row.project.id);
      return next;
    });
  }

  function runBulk(action: () => Promise<{ success: boolean; error?: string; count?: number }>, successVerb: string) {
    setBulkError(null);
    setBulkMessage(null);
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        setBulkError(result.error ?? "Bulk action failed.");
        return;
      }
      setBulkMessage(`${result.count ?? selectedIds.length} project${(result.count ?? selectedIds.length) === 1 ? "" : "s"} ${successVerb}.`);
      setSelected(new Set());
      router.refresh();
    });
  }

  function handleBulkDeleteConfirm() {
    setConfirmingBulkDelete(false);
    runBulk(() => bulkDeleteProjects(selectedIds), "deleted");
  }

  return (
    <div className="flex flex-col gap-6">
      <NeoCard className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="flex min-w-50 flex-1 flex-col gap-1.5">
          <label htmlFor={searchId} className="font-retro text-lg leading-none">
            Search
          </label>
          <input
            id={searchId}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Title, slug, or category"
            className="w-full neo-border bg-background px-3 py-2 font-sans text-sm focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={statusId} className="font-retro text-lg leading-none">
            Status
          </label>
          <select
            id={statusId}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            className="neo-border bg-background px-3 py-2 font-sans text-sm focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={featuredId} className="font-retro text-lg leading-none">
            Featured
          </label>
          <select
            id={featuredId}
            value={featuredFilter}
            onChange={(event) => setFeaturedFilter(event.target.value as FeaturedFilter)}
            className="neo-border bg-background px-3 py-2 font-sans text-sm focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
          >
            <option value="all">All</option>
            <option value="featured">Featured</option>
            <option value="not-featured">Not Featured</option>
          </select>
        </div>

        {filtersActive && (
          <button
            type="button"
            onClick={clearFilters}
            className={neoButtonClasses("secondary", "text-sm")}
          >
            Clear Filters
          </button>
        )}
      </NeoCard>

      {rows.length === 0 ? (
        <NeoCard>
          <p className="font-sans text-muted">No projects yet. Create your first one.</p>
          <Link href="/admin/projects/new" className={neoButtonClasses("primary", "mt-4")}>
            Create Project
          </Link>
        </NeoCard>
      ) : filtered.length === 0 ? (
        <NeoCard>
          <p className="font-sans text-muted">No projects match these filters.</p>
          <button type="button" onClick={clearFilters} className={neoButtonClasses("secondary", "mt-4")}>
            Clear Filters
          </button>
        </NeoCard>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="select-all-projects"
              checked={allFilteredSelected}
              onChange={toggleAllFiltered}
              aria-label={allFilteredSelected ? "Deselect all projects" : "Select all projects"}
              className="h-5 w-5 shrink-0 accent-accent"
            />
            <label htmlFor="select-all-projects" className="font-sans text-sm text-muted">
              Select all ({filtered.length})
            </label>
          </div>

          {selected.size > 0 && (
            <NeoCard
              accentShadow
              className="sticky bottom-4 z-10 flex flex-col gap-3 bg-surface-raised sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
            >
              <p className="font-sans text-sm font-semibold">
                {selected.size} selected
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => runBulk(() => bulkSetProjectsPublished(selectedIds, true), "published")}
                  className={neoButtonClasses("secondary", "text-sm")}
                >
                  Publish
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => runBulk(() => bulkSetProjectsPublished(selectedIds, false), "unpublished")}
                  className={neoButtonClasses("secondary", "text-sm")}
                >
                  Unpublish
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => runBulk(() => bulkSetProjectsFeatured(selectedIds, true), "marked featured")}
                  className={neoButtonClasses("secondary", "text-sm")}
                >
                  Mark Featured
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => runBulk(() => bulkSetProjectsFeatured(selectedIds, false), "removed from featured")}
                  className={neoButtonClasses("secondary", "text-sm")}
                >
                  Remove Featured
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setConfirmingBulkDelete(true)}
                  className={neoButtonClasses("secondary", "text-sm text-hot-pink!")}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete
                </button>
              </div>
            </NeoCard>
          )}

          {bulkError && (
            <p role="alert" className="font-sans text-sm text-hot-pink">
              {bulkError}
            </p>
          )}
          {bulkMessage && (
            <p role="status" className="font-sans text-sm text-crt-green">
              {bulkMessage}
            </p>
          )}

          <div className="flex flex-col gap-4">
            {filtered.map(({ project, canMoveUp, canMoveDown }) => (
              <NeoCard
                key={project.id}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selected.has(project.id)}
                    onChange={() => toggleOne(project.id)}
                    aria-label={`Select ${project.title}`}
                    className="mt-1 h-5 w-5 shrink-0 accent-accent"
                  />
                  <MoveButtons
                    itemLabel={project.title}
                    canMoveUp={canMoveUp}
                    canMoveDown={canMoveDown}
                    onMove={async (direction) => {
                      const result = await moveProject(project.id, direction);
                      if (result.success) {
                        setBulkError(null);
                        router.refresh();
                      } else {
                        setBulkError(result.error);
                      }
                      return result;
                    }}
                  />
                  <ProjectThumbnail src={project.media?.coverImage} alt={project.title} />
                  <div>
                    <h2 className="font-sans text-lg font-bold">{project.title}</h2>
                    <p className="mt-1 font-sans text-sm text-muted">
                      /{project.slug} · {project.category || "Uncategorized"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <PublishedBadge published={project.published} />
                      {project.featured && <FeaturedBadge />}
                      <ImageStatusBadge hasImage={Boolean(project.media?.coverImage)} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className={neoButtonClasses("secondary", "text-sm")}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Edit
                  </Link>
                  <PublishToggleButton id={project.id} published={project.published} />
                  <DeleteProjectButton id={project.id} title={project.title} />
                </div>
              </NeoCard>
            ))}
          </div>
        </>
      )}

      <Modal
        open={confirmingBulkDelete}
        onClose={() => setConfirmingBulkDelete(false)}
        title="Delete Selected Projects"
      >
        <p className="font-sans text-sm text-muted">
          Are you sure you want to permanently delete{" "}
          <span className="font-semibold text-foreground">{selected.size}</span>{" "}
          project{selected.size === 1 ? "" : "s"}? This cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setConfirmingBulkDelete(false)}
            className={neoButtonClasses("secondary")}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleBulkDeleteConfirm}
            disabled={isPending}
            className={neoButtonClasses(
              "secondary",
              "text-hot-pink! hover:bg-hot-pink! hover:text-pure-black!",
            )}
          >
            {isPending ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
