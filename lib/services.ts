import { createClient } from "@/lib/supabase/server";
import { isServiceIconId } from "@/lib/service-icons";
import type { ServiceIconId } from "@/lib/service-icons";
import type { ServiceRow } from "@/types/supabase";
import type { Service } from "@/types/service";

function mapRowToService(row: ServiceRow): Service {
  // icon is DB-constrained (CHECK) to the known ids, but the type
  // system doesn't know that — fall back to a safe default rather than
  // trusting an unvalidated string as ServiceIconId.
  const iconId: ServiceIconId = isServiceIconId(row.icon) ? row.icon : "wrench";
  return {
    id: row.id,
    iconId,
    title: row.title,
    description: row.description,
    order: row.sort_order,
  };
}

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("[getServices] Supabase query error:", error);
    return [];
  }
  return (data ?? []).map(mapRowToService);
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`[getServiceById] Supabase query error for "${id}":`, error);
    return undefined;
  }
  return data ? mapRowToService(data) : undefined;
}
