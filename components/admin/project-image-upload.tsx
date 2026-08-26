"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { ImageOff, Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { updateProjectCoverImage } from "@/lib/admin/project-actions";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  deleteProjectImage,
  pathFromPublicUrl,
  uploadProjectImage,
  validateImageFile,
} from "@/lib/supabase/storage";

export type ProjectImageUploadProps = {
  /** null before a project has been created — file selection is staged, not uploaded. */
  projectId: string | null;
  /** Current persisted cover image URL, if any. */
  value: string | null;
  /** Called when the persisted value changes (live mode) or should clear. */
  onChange: (url: string | null) => void;
  /** Create mode only: reports the picked file so the parent can upload it once the project has an id. */
  onStagedFileChange?: (file: File | null) => void;
};

type Status = "idle" | "uploading" | "error" | "success";

function formatMaxSize(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}

export function ProjectImageUpload({
  projectId,
  value,
  onChange,
  onStagedFileChange,
}: ProjectImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  function revokeStagedPreview() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  async function handleFile(file: File) {
    setError(null);

    const validationError = validateImageFile(file);
    if (validationError) {
      setStatus("error");
      setError(
        validationError.type === "invalid-type"
          ? "Unsupported file type. Use PNG, JPG, or WEBP."
          : `File is too large. Max size is ${formatMaxSize(validationError.maxBytes)}.`,
      );
      return;
    }

    revokeStagedPreview();
    const localPreview = URL.createObjectURL(file);
    objectUrlRef.current = localPreview;
    setPreview(localPreview);

    if (!projectId) {
      // Create mode: no project row exists yet, so there's nothing to
      // upload against. Stage the file; the parent form uploads it once
      // createProject() returns a real id.
      onStagedFileChange?.(file);
      setStatus("idle");
      return;
    }

    setStatus("uploading");
    const supabase = createClient();
    const previousValue = value;

    const result = await uploadProjectImage(supabase, projectId, file);
    if (!result.success) {
      setStatus("error");
      setError(
        result.reason === "permission"
          ? "You don't have permission to upload images."
          : `Upload failed: ${result.message}`,
      );
      setPreview(previousValue);
      return;
    }

    const saveResult = await updateProjectCoverImage(projectId, result.publicUrl);
    if (!saveResult.success) {
      // Storage upload succeeded but the DB save didn't — clean up the
      // orphaned object rather than leaving it unreferenced.
      await deleteProjectImage(supabase, result.path);
      setStatus("error");
      setError(`Image uploaded but failed to save: ${saveResult.error}`);
      setPreview(previousValue);
      return;
    }

    if (previousValue) {
      const previousPath = pathFromPublicUrl(previousValue);
      if (previousPath) await deleteProjectImage(supabase, previousPath);
    }

    setStatus("success");
    setPreview(result.publicUrl);
    onChange(result.publicUrl);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void handleFile(file);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  async function handleRemove() {
    setError(null);

    if (!projectId) {
      revokeStagedPreview();
      setPreview(null);
      onStagedFileChange?.(null);
      setStatus("idle");
      return;
    }

    setStatus("uploading");
    const removedValue = value;
    const result = await updateProjectCoverImage(projectId, null);

    if (!result.success) {
      setStatus("error");
      setError(`Failed to remove image: ${result.error}`);
      return;
    }

    setPreview(null);
    onChange(null);
    setStatus("idle");

    if (removedValue) {
      const path = pathFromPublicUrl(removedValue);
      if (path) {
        const supabase = createClient();
        await deleteProjectImage(supabase, path);
      }
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex aspect-video w-full max-w-md items-center justify-center overflow-hidden neo-border bg-background",
          isDragging && "outline-3 outline-offset-2 outline-[var(--color-focus)]",
        )}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Cover image preview"
            fill
            sizes="400px"
            className="object-cover"
            unoptimized={preview.startsWith("blob:")}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted">
            <ImageOff className="h-6 w-6" aria-hidden="true" />
            <span className="font-retro text-base tracking-wide">No image</span>
          </div>
        )}

        {status === "uploading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-pure-black/60">
            <Loader2 className="h-6 w-6 animate-spin text-off-white" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status === "uploading"}
          className="inline-flex items-center gap-2 neo-border bg-surface-raised px-4 py-2 font-sans text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-surface focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          {preview ? "Replace" : "Upload"} Image
        </button>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={status === "uploading"}
            className="inline-flex items-center gap-2 neo-border bg-surface-raised px-4 py-2 font-sans text-sm font-semibold uppercase tracking-wide text-hot-pink transition-colors hover:bg-surface focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        onChange={handleInputChange}
        aria-label="Choose a cover image"
        className="sr-only"
      />

      <p className="font-sans text-xs text-muted">
        PNG, JPG, or WEBP. Max {formatMaxSize(MAX_IMAGE_BYTES)}. Drag and drop
        or use the button above.
      </p>

      {error && (
        <p role="alert" className="font-sans text-sm text-hot-pink">
          {error}
        </p>
      )}
    </div>
  );
}
