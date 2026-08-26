import { createClient } from "@/lib/supabase/server";
import type { ProjectRow } from "@/types/supabase";
import type { Project } from "@/types/project";

function mapRowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category ?? "",
    shortDescription: row.short_description,
    featured: row.featured,
    published: row.published,
    order: row.sort_order,
    technologies: row.technologies,
    media: row.cover_image ? { coverImage: row.cover_image } : undefined,
    liveUrl: row.live_url ?? undefined,
    githubUrl: row.github_url ?? undefined,
    problem: row.problem ?? undefined,
    approach: row.approach ?? undefined,
    solution: row.solution ?? undefined,
    testimonial: row.testimonial
      ? { quote: row.testimonial, author: row.testimonial_author ?? "" }
      : undefined,
    updatedAt: row.updated_at,
  };
}

/**
 * RLS decides what rows come back — published-only for anonymous
 * visitors, everything for an authenticated admin session. No manual
 * `published` filtering happens in application code.
 *
 * Every read here logs a real Postgrest error before falling back to an
 * empty/undefined result, rather than silently treating "the query
 * failed" the same as "the row doesn't exist" — that conflation is what
 * made the Edit Project 404 impossible to diagnose from the UI alone.
 */
export async function getAllProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    // sort_order alone isn't guaranteed unique (e.g. two projects
    // created in quick succession could share a value); id is the
    // deterministic tie-break so admin reorder ("move up/down") always
    // matches the exact order shown, and public listings are stable.
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("[getAllProjects] Supabase query error:", error);
    return [];
  }
  return (data ?? []).map(mapRowToProject);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter((project) => project.featured);
}

/** Admin dashboard "Recent Projects" — most recently changed first. */
export async function getRecentProjects(limit: number): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getRecentProjects] Supabase query error:", error);
    return [];
  }
  return (data ?? []).map(mapRowToProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`[getProjectBySlug] Supabase query error for "${slug}":`, error);
    return undefined;
  }
  return data ? mapRowToProject(data) : undefined;
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`[getProjectById] Supabase query error for "${id}":`, error);
    return undefined;
  }
  return data ? mapRowToProject(data) : undefined;
}
