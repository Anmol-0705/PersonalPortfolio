"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { siteConfig } from "@/data/site-config";
import type { QuoteContext } from "@/types/quote";

export type ContactSubmission = {
  name: string;
  email: string;
  company?: string;
  message: string;
  quote?: QuoteContext;
};

/**
 * Placeholder submission handler. No backend or email provider is wired
 * up yet (planned for the contact-delivery integration phase) — this
 * only simulates network latency so the loading/success UI states are
 * real and testable, not a demonstration of actual delivery.
 */
async function submitContactRequest(
  submission: ContactSubmission,
): Promise<void> {
  void submission;
  await new Promise((resolve) => setTimeout(resolve, 700));
}

export type ContactFormProps = {
  context?: QuoteContext;
  initialMessage?: string;
};

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ context, initialMessage }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState(initialMessage ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(): boolean {
    const nextErrors: FieldErrors = {};

    if (!name.trim()) nextErrors.name = "Name is required.";
    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!message.trim()) nextErrors.message = "Message is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    try {
      await submitContactRequest({
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || undefined,
        message: message.trim(),
        quote: context,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="neo-border bg-background p-6">
        <p className="font-sans text-lg font-bold">Request ready.</p>
        <p className="mt-2 font-sans text-muted">
          Submission delivery will be connected in the contact integration
          phase. In the meantime, feel free to reach out directly and
          I&rsquo;ll get back to you.
        </p>
        <a
          href={`mailto:${siteConfig.email}`}
          className={neoButtonClasses("primary", "mt-4")}
        >
          Email {siteConfig.email}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {context && (
        <p className="font-retro text-base text-muted">
          This message includes your{" "}
          {context.engagementType === "quick-sprint"
            ? "Quick Sprint"
            : "Full Build"}{" "}
          selections.
        </p>
      )}

      <div>
        <label
          htmlFor="contact-name"
          className="block font-sans text-sm font-semibold uppercase tracking-wide"
        >
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className="mt-2 w-full neo-border bg-background px-3 py-2 font-sans focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
        />
        {errors.name && (
          <p id="contact-name-error" className="mt-1 font-sans text-sm text-hot-pink">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block font-sans text-sm font-semibold uppercase tracking-wide"
        >
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className="mt-2 w-full neo-border bg-background px-3 py-2 font-sans focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
        />
        {errors.email && (
          <p id="contact-email-error" className="mt-1 font-sans text-sm text-hot-pink">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="contact-company"
          className="block font-sans text-sm font-semibold uppercase tracking-wide"
        >
          Company <span className="text-muted normal-case">(optional)</span>
        </label>
        <input
          id="contact-company"
          type="text"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          className="mt-2 w-full neo-border bg-background px-3 py-2 font-sans focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block font-sans text-sm font-semibold uppercase tracking-wide"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className="mt-2 w-full neo-border bg-background px-3 py-2 font-sans focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1 font-sans text-sm text-hot-pink">
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="font-sans text-sm text-hot-pink">
          Something went wrong preparing your request. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className={neoButtonClasses("primary", "w-full")}
      >
        {status === "submitting" ? "Preparing..." : "Send Message"}
      </button>
    </form>
  );
}
