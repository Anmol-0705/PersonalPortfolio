import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { AdminNav } from "@/components/admin/admin-nav";
import { DeleteServiceButton } from "@/components/admin/delete-service-button";
import { ServiceMoveButtons } from "@/components/admin/service-move-buttons";
import { serviceIconMap } from "@/lib/service-icons";
import { getServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "Manage Services",
  robots: { index: false, follow: false },
};

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div className="flex flex-col gap-6">
      <AdminNav current="services" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-sans text-3xl font-bold">Services</h1>
        <Link href="/admin/services/new" className={neoButtonClasses("primary")}>
          + Add Service
        </Link>
      </div>

      {services.length === 0 ? (
        <NeoCard>
          <p className="font-sans text-muted">
            No services yet. Add your first one.
          </p>
          <Link href="/admin/services/new" className={neoButtonClasses("primary", "mt-4")}>
            Add Service
          </Link>
        </NeoCard>
      ) : (
        <div className="flex flex-col gap-4">
          {services.map((service, index) => {
            const Icon = serviceIconMap[service.iconId];
            return (
              <NeoCard
                key={service.id}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <ServiceMoveButtons
                    id={service.id}
                    title={service.title}
                    canMoveUp={index > 0}
                    canMoveDown={index < services.length - 1}
                  />
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-border bg-accent text-off-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-sans text-lg font-bold">{service.title}</h2>
                    <p className="mt-1 font-sans text-sm text-muted">
                      order {service.order}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/services/${service.id}/edit`}
                    className={neoButtonClasses("secondary", "text-sm")}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Edit
                  </Link>
                  <DeleteServiceButton id={service.id} title={service.title} />
                </div>
              </NeoCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
