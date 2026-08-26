"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { describeError } from "@/lib/admin/errors";
import { swapSortOrder } from "@/lib/admin/reorder";
import { isSocialIconId, CUSTOM_SOCIAL_ICON_IDS } from "@/lib/social-icons";
import { isSocialPlatform, socialPlatformIcon } from "@/lib/social-platforms";
import type { SocialLinkInsert, SocialLinkUpdate } from "@/types/supabase";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string };

export type SocialLinkFormInput = {
  platform: string;
  label: string;
  url: string;
  /** Only consulted when platform === "custom" — every other platform's icon is derived automatically. */
  iconId: string;
  enabled: boolean;
  sortOrder: number;
};

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validates input and, on success, returns the exact icon id to persist
 * (derived from platform for every non-custom platform — never
 * client-trusted for those — or the validated custom choice).
 */
function validate(input: SocialLinkFormInput): { error: string } | { error: null; icon: string } {
  const label = input.label.trim();
  const url = input.url.trim();

  if (!isSocialPlatform(input.platform)) {
    return { error: "Choose a valid platform from the list." };
  }
  if (!label || label.length > 100) {
    return { error: "A label (1-100 characters) is required." };
  }
  if (!url) {
    return { error: "A URL is required." };
  }
  if (input.platform === "email") {
    if (url.length > 320 || !EMAIL_PATTERN.test(url)) {
      return { error: "Enter a valid email address (not a mailto: link)." };
    }
  } else if (!isValidUrl(url)) {
    return { error: "Enter a valid http(s) URL." };
  }
  if (!Number.isInteger(input.sortOrder) || input.sortOrder < 0) {
    return { error: "Sort order must be a non-negative whole number." };
  }

  if (input.platform === "custom") {
    if (!isSocialIconId(input.iconId) || !CUSTOM_SOCIAL_ICON_IDS.includes(input.iconId)) {
      return { error: "Choose a valid icon for a custom link." };
    }
    return { error: null, icon: input.iconId };
  }

  return { error: null, icon: socialPlatformIcon[input.platform] };
}

function revalidatePublicRoutes() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/socials");
}

export async function createSocialLink(input: SocialLinkFormInput): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const validation = validate(input);
  if (validation.error !== null) return { success: false, error: validation.error };

  const payload: SocialLinkInsert = {
    platform: input.platform,
    label: input.label.trim(),
    url: input.url.trim(),
    icon: validation.icon,
    enabled: input.enabled,
    sort_order: input.sortOrder,
  };

  const { data, error } = await supabase
    .from("social_links")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error
        ? describeError("createSocialLink", error, "Failed to create social link.")
        : "Failed to create social link.",
    };
  }

  revalidatePublicRoutes();
  return { success: true, id: data.id };
}

export async function updateSocialLink(
  id: string,
  input: SocialLinkFormInput,
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const validation = validate(input);
  if (validation.error !== null) return { success: false, error: validation.error };

  const payload: SocialLinkUpdate = {
    platform: input.platform,
    label: input.label.trim(),
    url: input.url.trim(),
    icon: validation.icon,
    enabled: input.enabled,
    sort_order: input.sortOrder,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("social_links").update(payload).eq("id", id);

  if (error) {
    return { success: false, error: describeError("updateSocialLink", error, "Failed to update social link.") };
  }

  revalidatePublicRoutes();
  return { success: true, id };
}

export async function moveSocialLink(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const { data: rows, error } = await supabase
    .from("social_links")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error || !rows) {
    return {
      success: false,
      error: error
        ? describeError("moveSocialLink", error, "Failed to reorder social link.")
        : "Failed to reorder social link.",
    };
  }

  const index = rows.findIndex((row) => row.id === id);
  if (index === -1) return { success: false, error: "Social link not found." };

  const neighborIndex = direction === "up" ? index - 1 : index + 1;
  const neighbor = rows[neighborIndex];
  if (!neighbor) {
    return { success: false, error: `Already at the ${direction === "up" ? "top" : "bottom"}.` };
  }

  const current = rows[index];
  const result = await swapSortOrder(supabase, "social_links", "moveSocialLink", current, neighbor);
  if (!result.success) return result;

  revalidatePublicRoutes();
  return { success: true, id };
}

export async function deleteSocialLink(id: string): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { success: false, error: "Not authorized." };

  const { error } = await supabase.from("social_links").delete().eq("id", id);

  if (error) {
    return { success: false, error: describeError("deleteSocialLink", error, "Failed to delete social link.") };
  }

  revalidatePublicRoutes();
  return { success: true, id };
}
