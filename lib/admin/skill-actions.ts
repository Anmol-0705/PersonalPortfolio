"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { describeError } from "@/lib/admin/errors";
import { swapSortOrder } from "@/lib/admin/reorder";
import type { SkillInsert, SkillUpdate } from "@/types/supabase";

export type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string };

export type SkillFormInput = {
  name: string;
  category: string;
  sortOrder: number;
};

function validate(input: SkillFormInput): string | null {
  const name = input.name.trim();
  const category = input.category.trim();

  if (!name || name.length > 100) {
    return "A skill name (1-100 characters) is required.";
  }
  if (!category || category.length > 100) {
    return "A category (1-100 characters) is required.";
  }
  if (!Number.isInteger(input.sortOrder) || input.sortOrder < 0) {
    return "Sort order must be a non-negative whole number.";
  }

  return null;
}

function revalidatePublicRoutes() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/skills");
}

export async function createSkill(input: SkillFormInput): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const validationError = validate(input);
  if (validationError) return { success: false, error: validationError };

  const payload: SkillInsert = {
    name: input.name.trim(),
    category: input.category.trim(),
    sort_order: input.sortOrder,
  };

  const { data, error } = await supabase
    .from("skills")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error
        ? describeError("createSkill", error, "Failed to create skill.")
        : "Failed to create skill.",
    };
  }

  revalidatePublicRoutes();
  return { success: true, id: data.id };
}

export async function updateSkill(
  id: string,
  input: SkillFormInput,
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const validationError = validate(input);
  if (validationError) return { success: false, error: validationError };

  const payload: SkillUpdate = {
    name: input.name.trim(),
    category: input.category.trim(),
    sort_order: input.sortOrder,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("skills").update(payload).eq("id", id);

  if (error) {
    return { success: false, error: describeError("updateSkill", error, "Failed to update skill.") };
  }

  revalidatePublicRoutes();
  return { success: true, id };
}

/**
 * Skills are displayed publicly grouped by category (see
 * lib/skills.ts's groupByCategory) — moving a skill "up/down" must stay
 * within its own category's neighbors, not jump into an adjacent
 * category's skill, or the reorder would silently reshuffle category
 * grouping instead of just reordering within it.
 */
export async function moveSkill(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const { data: rows, error } = await supabase
    .from("skills")
    .select("id, category, sort_order")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error || !rows) {
    return {
      success: false,
      error: error
        ? describeError("moveSkill", error, "Failed to reorder skill.")
        : "Failed to reorder skill.",
    };
  }

  const current = rows.find((row) => row.id === id);
  if (!current) return { success: false, error: "Skill not found." };

  const sameCategory = rows.filter((row) => row.category === current.category);
  const index = sameCategory.findIndex((row) => row.id === id);
  const neighborIndex = direction === "up" ? index - 1 : index + 1;
  const neighbor = sameCategory[neighborIndex];
  if (!neighbor) {
    return { success: false, error: `Already at the ${direction === "up" ? "top" : "bottom"} of this category.` };
  }

  const result = await swapSortOrder(supabase, "skills", "moveSkill", current, neighbor);
  if (!result.success) return result;

  revalidatePublicRoutes();
  return { success: true, id };
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const { error } = await supabase.from("skills").delete().eq("id", id);

  if (error) {
    return { success: false, error: describeError("deleteSkill", error, "Failed to delete skill.") };
  }

  revalidatePublicRoutes();
  return { success: true, id };
}
