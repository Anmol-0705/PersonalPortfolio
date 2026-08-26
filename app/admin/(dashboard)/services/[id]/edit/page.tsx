import type { Metadata } from "next";
import Link from "next/link";
import { ServiceForm } from "@/components/admin/service-form";
import { AdminNav } from "@/components/admin/admin-nav";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { getServiceById } from "@/lib/services";

export const metadata: Metadata = {
  title: "Edit Service",
  robots: { index: false, follow: false },
};

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    return (
      <div className="flex flex-col gap-6">
        <AdminNav current="services" />
        <h1 className="font-sans text-3xl font-bold">Service Not Found</h1>
        <NeoCard>
          <p className="font-sans text-muted">
            No service exists for id <code>{id}</code>. It may have been
            deleted, or the link may be stale.
          </p>
          <Link href="/admin/services" className={neoButtonClasses("primary", "mt-4")}>
            Back to Services
          </Link>
        </NeoCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminNav current="services" />
      <h1 className="font-sans text-3xl font-bold">Edit Service</h1>
      <ServiceForm mode="edit" service={service} />
    </div>
  );
}
