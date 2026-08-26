import type { ServiceIconId } from "@/lib/service-icons";

export type Service = {
  id: string;
  iconId: ServiceIconId;
  title: string;
  description: string;
  order: number;
};
