"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { siteConfig } from "@/data/site-config";
import type { ContactApiResponse, ContactRequestPayload } from "@/types/contact";
import type { QuoteContext } from "@/types/quote";

async function submitContactRequest(
  payload: ContactRequestPayload,
): Promise<ContactApiResponse> {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as ContactApiResponse;
    return data;
  } catch {
    return {
      success: false,
      error:
        "Something went wrong while sending your request. Please try again or contact me directly by email.",
    };
  }
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
const RESUBMIT_COOLDOWN_MS = 4000;

export function ContactForm({ context, initialMessage }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState(initialMessage ?? "");
  const [website, setWebsite] = useState(""); // honeypot — real users leave this empty
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const lastSubmittedAt = useRef(0);

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

    const now = Date.now();
    if (now - lastSubmittedAt.current < RESUBMIT_COOLDOWN_MS) return;
    if (!validate()) return;

    lastSubmittedAt.current = now;
    setStatus("submitting");
    setErrorMessage(null);

    const result = await submitContactRequest({
      name: name.trim(),
      email: email.trim(),
      company: company.trim() || undefined,
      message: message.trim(),
      quote: context,
      website,
    });

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="neo-border bg-background p-6">
        <p className="font-sans text-lg font-bold">
          Thanks, your request has been sent successfully.
        </p>
        <p className="mt-2 font-sans text-muted">
          I&rsquo;ll get back to you soon.
        </p>
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

      {/* Honeypot field: hidden from sighted and assistive-tech users, left
         out of tab order. Bots that auto-fill every field will trip it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

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
          <p id="contact-name-error" role="alert" className="mt-1 font-sans text-sm text-hot-pink">
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
          <p id="contact-email-error" role="alert" className="mt-1 font-sans text-sm text-hot-pink">
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
          <p id="contact-message-error" role="alert" className="mt-1 font-sans text-sm text-hot-pink">
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <div role="alert" className="neo-border bg-background p-4">
          <p className="font-sans text-sm text-hot-pink">
            {errorMessage ??
              "Something went wrong while sending your request. Please try again or contact me directly by email."}
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-2 inline-block font-sans text-sm underline decoration-2 underline-offset-4 hover:text-accent focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
          >
            Email {siteConfig.email} directly
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className={neoButtonClasses("primary", "w-full")}
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
