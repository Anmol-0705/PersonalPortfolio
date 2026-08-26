"use client";

import { useState, useTransition } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { cn } from "@/lib/utils";
import {
  SERVICE_ICON_IDS,
  serviceIconLabels,
  serviceIconMap,
} from "@/lib/service-icons";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import { createService, updateService } from "@/lib/admin/service-actions";
import type { ServiceFormInput } from "@/lib/admin/service-actions";
import type { Service } from "@/types/service";

export type ServiceFormProps =
  | { mode: "create"; service?: undefined; nextSortOrder: number }
  | { mode: "edit"; service: Service; nextSortOrder?: undefined };

function toFormState(
  service: Service | undefined,
  nextSortOrder: number | undefined,
): ServiceFormInput {
  return {
    title: service?.title ?? "",
    description: service?.description ?? "",
    iconId: service?.iconId ?? SERVICE_ICON_IDS[0],
    sortOrder: service?.order ?? nextSortOrder ?? 0,
  };
}

export function ServiceForm({ mode, service, nextSortOrder }: ServiceFormProps) {
  const router = useRouter();
  const [initialForm] = useState<ServiceFormInput>(() => toFormState(service, nextSortOrder));
  const [form, setForm] = useState<ServiceFormInput>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const isDirty = !justSaved && JSON.stringify(form) !== JSON.stringify(initialForm);
  useUnsavedChangesWarning(isDirty);

  function updateField<K extends keyof ServiceFormInput>(key: K, value: ServiceFormInput[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function handleCancel() {
    if (isDirty && !window.confirm("You have unsaved changes. Leave without saving?")) {
      return;
    }
    router.push("/admin/services");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result =
        mode === "create" ? await createService(form) : await updateService(service.id, form);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setJustSaved(true);
      router.push("/admin/services");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <NeoCard className="flex flex-col gap-4">
        <Field label="Title" htmlFor="title">
          <input
            id="title"
            required
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Description" htmlFor="description">
          <textarea
            id="description"
            required
            rows={3}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Icon" htmlFor="icon">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Icon">
            {SERVICE_ICON_IDS.map((iconId) => {
              const Icon = serviceIconMap[iconId];
              const selected = form.iconId === iconId;
              return (
                <button
                  key={iconId}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => updateField("iconId", iconId)}
                  className={cn(
                    "flex items-center gap-2 neo-border px-3 py-2 font-sans text-sm transition-colors focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2",
                    selected
                      ? "bg-accent text-off-white"
                      : "bg-surface-raised hover:bg-surface",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {serviceIconLabels[iconId]}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Sort Order" htmlFor="sortOrder">
          <input
            id="sortOrder"
            type="number"
            min={0}
            step={1}
            required
            value={form.sortOrder}
            onChange={(event) => updateField("sortOrder", Number(event.target.value))}
            className={inputClass}
          />
        </Field>
      </NeoCard>

      {error && (
        <p role="alert" className="font-sans text-sm text-hot-pink">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className={neoButtonClasses("primary")}>
          {isPending ? "Saving..." : mode === "create" ? "Add Service" : "Save Changes"}
        </button>
        <button type="button" onClick={handleCancel} className={neoButtonClasses("secondary")}>
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full neo-border bg-background px-3 py-2 font-sans text-sm focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-retro text-lg leading-none">
        {label}
      </label>
      {children}
    </div>
  );
}
