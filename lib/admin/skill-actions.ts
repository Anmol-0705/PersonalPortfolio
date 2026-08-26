"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { describeError } from "@/lib/admin/errors";
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
