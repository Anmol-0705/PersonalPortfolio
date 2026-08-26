import { Rocket, Layers, PenTool, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Controlled icon identifiers, matching the four icons the original
 * data/services.ts used. The database stores only these string ids
 * (also enforced by a CHECK constraint — see
 * supabase/migrations/0006_create_services_table.sql) — never a
 * component name or anything dynamically imported. The admin UI selects
 * from this fixed list; nothing in the database can add a new one.
 */
export const SERVICE_ICON_IDS = ["rocket", "layers", "pen-tool", "wrench"] as const;

export type ServiceIconId = (typeof SERVICE_ICON_IDS)[number];

export const serviceIconMap: Record<ServiceIconId, LucideIcon> = {
  rocket: Rocket,
  layers: Layers,
  "pen-tool": PenTool,
  wrench: Wrench,
};

export const serviceIconLabels: Record<ServiceIconId, string> = {
  rocket: "Rocket",
  layers: "Layers",
  "pen-tool": "Pen Tool",
  wrench: "Wrench",
};

export function isServiceIconId(value: string): value is ServiceIconId {
  return (SERVICE_ICON_IDS as readonly string[]).includes(value);
}
