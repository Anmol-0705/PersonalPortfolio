"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { describeError } from "@/lib/admin/errors";
import { isServiceIconId } from "@/lib/service-icons";
import type { ServiceInsert, ServiceUpdate } from "@/types/supabase";

export type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string };

export type ServiceFormInput = {
  title: string;
  description: string;
  iconId: string;
  sortOrder: number;
};

function validate(input: ServiceFormInput): string | null {
  const title = input.title.trim();
  const description = input.description.trim();

  if (!title || title.length > 200) {
    return "A title (1-200 characters) is required.";
  }
  if (!description || description.length > 1000) {
    return "A description (1-1000 characters) is required.";
  }
  if (!isServiceIconId(input.iconId)) {
    return "Choose a valid icon from the list.";
  }
  if (!Number.isInteger(input.sortOrder) || input.sortOrder < 0) {
    return "Sort order must be a non-negative whole number.";
  }

  return null;
}

function revalidatePublicRoutes() {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function createService(input: ServiceFormInput): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const validationError = validate(input);
  if (validationError) return { success: false, error: validationError };

  const payload: ServiceInsert = {
    title: input.title.trim(),
    description: input.description.trim(),
    icon: input.iconId,
    sort_order: input.sortOrder,
  };

  const { data, error } = await supabase
    .from("services")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error
        ? describeError("createService", error, "Failed to create service.")
        : "Failed to create service.",
    };
  }

  revalidatePublicRoutes();
  return { success: true, id: data.id };
}

export async function updateService(
  id: string,
  input: ServiceFormInput,
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const validationError = validate(input);
  if (validationError) return { success: false, error: validationError };

  const payload: ServiceUpdate = {
    title: input.title.trim(),
    description: input.description.trim(),
    icon: input.iconId,
    sort_order: input.sortOrder,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("services").update(payload).eq("id", id);

  if (error) {
    return { success: false, error: describeError("updateService", error, "Failed to update service.") };
  }

  revalidatePublicRoutes();
  return { success: true, id };
}

export async function deleteService(id: string): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    return { success: false, error: describeError("deleteService", error, "Failed to delete service.") };
  }

  revalidatePublicRoutes();
  return { success: true, id };
}
