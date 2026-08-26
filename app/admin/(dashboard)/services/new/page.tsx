import type { Metadata } from "next";
import { ServiceForm } from "@/components/admin/service-form";
import { AdminNav } from "@/components/admin/admin-nav";
import { getServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "New Service",
  robots: { index: false, follow: false },
};

export default async function NewServicePage() {
  const services = await getServices();

  return (
    <div className="flex flex-col gap-6">
      <AdminNav current="services" />
      <h1 className="font-sans text-3xl font-bold">New Service</h1>
      <ServiceForm mode="create" nextSortOrder={services.length} />
    </div>
  );
}
