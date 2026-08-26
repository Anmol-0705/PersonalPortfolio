"use client";

import { useState, useTransition } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import {
  SOCIAL_PLATFORMS,
  socialPlatformLabels,
  socialPlatformIcon,
  isSocialPlatform,
} from "@/lib/social-platforms";
import { CUSTOM_SOCIAL_ICON_IDS, socialIconMap, socialIconLabels } from "@/lib/social-icons";
import { useDirtyFormGuard } from "@/hooks/use-dirty-form-guard";
import { useUnsavedChangesContext } from "@/components/admin/unsaved-changes-provider";
import { createSocialLink, updateSocialLink } from "@/lib/admin/social-link-actions";
import type { SocialLinkFormInput } from "@/lib/admin/social-link-actions";
import type { SocialLink } from "@/types/social-link";

export type SocialLinkFormProps =
  | { mode: "create"; socialLink?: undefined; nextSortOrder: number }
  | { mode: "edit"; socialLink: SocialLink; nextSortOrder?: undefined };

function toFormState(
  socialLink: SocialLink | undefined,
  nextSortOrder: number | undefined,
): SocialLinkFormInput {
  return {
    platform: socialLink?.platform ?? "github",
    label: socialLink?.label ?? "",
    url: socialLink?.url ?? "",
    iconId: socialLink?.platform === "custom" ? socialLink.iconId : CUSTOM_SOCIAL_ICON_IDS[0],
    enabled: socialLink?.enabled ?? true,
    sortOrder: socialLink?.order ?? nextSortOrder ?? 0,
  };
}

export function SocialLinkForm({ mode, socialLink, nextSortOrder }: SocialLinkFormProps) {
  const router = useRouter();
  const [initialForm] = useState<SocialLinkFormInput>(() => toFormState(socialLink, nextSortOrder));
  const [form, setForm] = useState<SocialLinkFormInput>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const isDirty = !justSaved && JSON.stringify(form) !== JSON.stringify(initialForm);
  useDirtyFormGuard(isDirty);
  const { confirmDiscard } = useUnsavedChangesContext();

  function updateField<K extends keyof SocialLinkFormInput>(key: K, value: SocialLinkFormInput[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function handlePlatformChange(value: string) {
    updateField("platform", value);
  }

  function handleCancel() {
    if (!isDirty) {
      router.push("/admin/socials");
      return;
    }
    confirmDiscard(() => router.push("/admin/socials"));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createSocialLink(form)
          : await updateSocialLink(socialLink.id, form);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setJustSaved(true);
      router.push("/admin/socials");
      router.refresh();
    });
  }

  const isCustom = form.platform === "custom";
  const validPlatform = isSocialPlatform(form.platform) ? form.platform : null;
  const derivedIcon =
    validPlatform && validPlatform !== "custom" ? socialPlatformIcon[validPlatform] : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <NeoCard className="flex flex-col gap-4">
        <Field label="Platform" htmlFor="platform">
          <select
            id="platform"
            required
            value={form.platform}
            onChange={(event) => handlePlatformChange(event.target.value)}
            className={inputClass}
          >
            {SOCIAL_PLATFORMS.map((platform) => (
              <option key={platform} value={platform}>
                {socialPlatformLabels[platform]}
              </option>
            ))}
          </select>
        </Field>

        {isCustom ? (
          <Field label="Icon" htmlFor="icon">
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Icon">
              {CUSTOM_SOCIAL_ICON_IDS.map((iconId) => {
                const Icon = socialIconMap[iconId];
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
                    {socialIconLabels[iconId]}
                  </button>
                );
              })}
            </div>
          </Field>
        ) : (
          derivedIcon && validPlatform && (
            <p className="font-sans text-sm text-muted">
              Icon: <span className="font-semibold text-foreground">{socialIconLabels[derivedIcon]}</span>{" "}
              (fixed for {socialPlatformLabels[validPlatform]})
            </p>
          )
        )}

        <Field label="Label" htmlFor="label">
          <input
            id="label"
            required
            placeholder="e.g. Connect on LinkedIn"
            value={form.label}
            onChange={(event) => updateField("label", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field
          label={form.platform === "email" ? "Email Address" : "URL"}
          htmlFor="url"
        >
          <input
            id="url"
            type={form.platform === "email" ? "email" : "url"}
            required
            placeholder={form.platform === "email" ? "you@example.com" : "https://..."}
            value={form.url}
            onChange={(event) => updateField("url", event.target.value)}
            className={inputClass}
          />
          {form.platform === "email" && (
            <p className="font-sans text-xs text-muted">
              Enter a plain email address — not a mailto: link. The mailto:
              link is built automatically wherever this is shown.
            </p>
          )}
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

        <Toggle
          checked={form.enabled}
          onChange={(checked) => updateField("enabled", checked)}
          label="Enabled (publicly visible)"
          showLabel
        />
      </NeoCard>

      {error && (
        <p role="alert" className="font-sans text-sm text-hot-pink">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className={neoButtonClasses("primary")}>
          {isPending ? "Saving..." : mode === "create" ? "Add Social Link" : "Save Changes"}
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
