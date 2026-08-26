"use server";

import { revalidatePath } from "next/cache";
import type { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { PROJECT_IMAGES_BUCKET, pathFromPublicUrl } from "@/lib/supabase/storage";
import type { ProjectInsert, ProjectUpdate } from "@/types/supabase";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type ActionResult =
  | { success: true; id: string; slug: string }
  | { success: false; error: string };

export type ProjectFormInput = {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  problem: string;
  approach: string;
  solution: string;
  technologies: string[];
  featured: boolean;
  published: boolean;
  liveUrl: string;
  githubUrl: string;
  testimonialQuote: string;
  testimonialAuthor: string;
};

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("[requireAdmin] no authenticated user", userError?.message);
    return { supabase, ok: false as const };
  }

  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    console.error("[requireAdmin] is_admin() returned falsy", {
      isAdmin,
      rpcError: rpcError?.message,
      userId: user.id,
    });
    return { supabase, ok: false as const };
  }

  return { supabase, ok: true as const };
}

/**
 * Logs the real Postgrest error server-side (never swallowed — this is
 * what hid the original create-project bug), and builds a user-facing
 * message: exact detail in development, a safe generic message in
 * production so database internals never reach a browser.
 */
function describeError(context: string, error: PostgrestError, fallback: string): string {
  console.error(`[${context}] Supabase error:`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });

  if (process.env.NODE_ENV !== "production") {
    return `${fallback} [DEV] ${error.code ?? "?"}: ${error.message}${error.details ? ` — ${error.details}` : ""}${error.hint ? ` (hint: ${error.hint})` : ""}`;
  }

  return fallback;
}

function validate(input: ProjectFormInput): string | null {
  const slug = input.slug.trim();
  const title = input.title.trim();
  const shortDescription = input.shortDescription.trim();

  if (!title || title.length > 200) {
    return "A title (1-200 characters) is required.";
  }
  if (!slug || !SLUG_PATTERN.test(slug)) {
    return "Slug must be lowercase letters, numbers, and hyphens only (e.g. my-project).";
  }
  if (!shortDescription || shortDescription.length > 500) {
    return "A short description (1-500 characters) is required.";
  }
  if (input.technologies.some((tech) => !tech.trim())) {
    return "Technology entries cannot be empty.";
  }
  if (input.liveUrl && !isValidUrl(input.liveUrl)) {
    return "Live URL must be a valid URL.";
  }
  if (input.githubUrl && !isValidUrl(input.githubUrl)) {
    return "GitHub URL must be a valid URL.";
  }

  return null;
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function toInsertPayload(input: ProjectFormInput, sortOrder: number): ProjectInsert {
  return {
    slug: input.slug.trim(),
    title: input.title.trim(),
    short_description: input.shortDescription.trim(),
    problem: input.problem.trim() || null,
    approach: input.approach.trim() || null,
    solution: input.solution.trim() || null,
    technologies: input.technologies.map((tech) => tech.trim()).filter(Boolean),
    category: input.category.trim() || null,
    featured: input.featured,
    published: input.published,
    live_url: input.liveUrl.trim() || null,
    github_url: input.githubUrl.trim() || null,
    testimonial: input.testimonialQuote.trim() || null,
    testimonial_author: input.testimonialAuthor.trim() || null,
    sort_order: sortOrder,
  };
}

function toUpdatePayload(input: ProjectFormInput): ProjectUpdate {
  return {
    slug: input.slug.trim(),
    title: input.title.trim(),
    short_description: input.shortDescription.trim(),
    problem: input.problem.trim() || null,
    approach: input.approach.trim() || null,
    solution: input.solution.trim() || null,
    technologies: input.technologies.map((tech) => tech.trim()).filter(Boolean),
    category: input.category.trim() || null,
    featured: input.featured,
    published: input.published,
    live_url: input.liveUrl.trim() || null,
    github_url: input.githubUrl.trim() || null,
    testimonial: input.testimonialQuote.trim() || null,
    testimonial_author: input.testimonialAuthor.trim() || null,
    updated_at: new Date().toISOString(),
  };
}

function revalidatePublicRoutes(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/projects/${slug}`);
}

export async function createProject(input: ProjectFormInput): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const validationError = validate(input);
  if (validationError) return { success: false, error: validationError };

  const slug = input.slug.trim();

  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "A project with this slug already exists." };
  }

  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true });

  const { data, error } = await supabase
    .from("projects")
    .insert(toInsertPayload(input, count ?? 0))
    .select("id")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      return { success: false, error: "A project with this slug already exists." };
    }
    return {
      success: false,
      error: error
        ? describeError("createProject", error, "Failed to create project.")
        : "Failed to create project.",
    };
  }

  revalidatePublicRoutes(slug);
  return { success: true, id: data.id, slug };
}

export async function updateProject(
  id: string,
  input: ProjectFormInput,
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const validationError = validate(input);
  if (validationError) return { success: false, error: validationError };

  const slug = input.slug.trim();

  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "A project with this slug already exists." };
  }

  const { error } = await supabase
    .from("projects")
    .update(toUpdatePayload(input))
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A project with this slug already exists." };
    }
    return { success: false, error: describeError("updateProject", error, "Failed to update project.") };
  }

  revalidatePublicRoutes(slug);
  return { success: true, id, slug };
}

export async function updateProjectCoverImage(
  id: string,
  coverImageUrl: string | null,
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const { data, error } = await supabase
    .from("projects")
    .update({ cover_image: coverImageUrl, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("slug")
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error
        ? describeError("updateProjectCoverImage", error, "Failed to save the image.")
        : "Failed to save the image.",
    };
  }

  revalidatePublicRoutes(data.slug);
  return { success: true, id, slug: data.slug };
}

export async function setProjectPublished(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const { data, error } = await supabase
    .from("projects")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("slug")
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error
        ? describeError("setProjectPublished", error, "Failed to update project.")
        : "Failed to update project.",
    };
  }

  revalidatePublicRoutes(data.slug);
  return { success: true, id, slug: data.slug };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .select("slug, cover_image")
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error
        ? describeError("deleteProject", error, "Failed to delete project.")
        : "Failed to delete project.",
    };
  }

  if (data.cover_image) {
    const path = pathFromPublicUrl(data.cover_image);
    if (path) {
      const { error: storageError } = await supabase.storage
        .from(PROJECT_IMAGES_BUCKET)
        .remove([path]);
      if (storageError) {
        console.error("[deleteProject] failed to remove cover image:", storageError.message);
      }
    }
  }

  revalidatePublicRoutes(data.slug);
  return { success: true, id, slug: data.slug };
}
