import type { SupabaseClient } from "@supabase/supabase-js";

export const PROJECT_IMAGES_BUCKET = "project-images";

export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export type ImageValidationError =
  | { type: "invalid-type" }
  | { type: "too-large"; maxBytes: number };

export function validateImageFile(file: File): ImageValidationError | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return { type: "invalid-type" };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { type: "too-large", maxBytes: MAX_IMAGE_BYTES };
  }
  return null;
}

export type UploadResult =
  | { success: true; path: string; publicUrl: string }
  | { success: false; reason: "permission" | "upload-failed"; message: string };

/**
 * Uploads under a path scoped to the project's id, e.g.
 * `projects/{projectId}/{uuid}.webp` — never the user's original
 * filename, and never guessable ahead of the project actually existing.
 */
export async function uploadProjectImage(
  supabase: SupabaseClient,
  projectId: string,
  file: File,
): Promise<UploadResult> {
  const extension = EXTENSION_BY_MIME[file.type] ?? "bin";
  const path = `projects/${projectId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    const message = error.message ?? "Upload failed.";
    const isPermissionError = /permission|policy|not authorized|rls/i.test(message);
    console.error("[uploadProjectImage] Supabase Storage error:", message);
    return {
      success: false,
      reason: isPermissionError ? "permission" : "upload-failed",
      message,
    };
  }

  const { data } = supabase.storage.from(PROJECT_IMAGES_BUCKET).getPublicUrl(path);
  return { success: true, path, publicUrl: data.publicUrl };
}

/**
 * Best-effort cleanup — failures are logged, not surfaced, since an
 * orphaned old file is a minor cost, not an inconsistency (the DB row
 * already points at the new/no image by the time this runs).
 */
export async function deleteProjectImage(
  supabase: SupabaseClient,
  path: string,
): Promise<void> {
  const { error } = await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove([path]);
  if (error) {
    console.error("[deleteProjectImage] Supabase Storage error:", error.message);
  }
}

/**
 * The bucket is public-read, so cover images are served from a
 * predictable `/storage/v1/object/public/<bucket>/<path>` URL. Given a
 * full public URL, recover just the object path so it can be removed.
 */
export function pathFromPublicUrl(publicUrl: string): string | null {
  const marker = `/object/public/${PROJECT_IMAGES_BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;
  return publicUrl.slice(index + marker.length);
}
