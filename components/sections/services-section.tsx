import { NeoCard } from "@/components/ui/neo-card";
import { SectionHeading } from "@/components/sections/section-heading";
import { serviceIconMap } from "@/lib/service-icons";
import { getServices } from "@/lib/services";

export async function ServicesSection() {
  const services = await getServices();

  if (services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="border-b-[3px] border-border bg-surface">
      <div className="container-app py-20 sm:py-28">
        <SectionHeading
          eyebrow="// 02 SERVICES"
          title="What I can build for you"
          align="center"
          className="mx-auto"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((service, index) => {
            const Icon = serviceIconMap[service.iconId];
            return (
              <NeoCard
                key={service.id}
                className="group bg-surface-raised transition-transform duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--color-border)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center border-2 border-border bg-accent text-off-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="font-retro text-base text-muted">
                    {`SVC_${String(index + 1).padStart(2, "0")}`}
                  </span>
                </div>

                <h3 className="mt-5 font-sans text-xl font-bold">
                  {service.title}
                </h3>
                <p className="mt-2 font-sans text-muted">
                  {service.description}
                </p>
              </NeoCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
