import { Modal } from "@/components/ui/modal";
import { ContactForm } from "@/components/contact/contact-form";
import { summarizeProject, summarizeQuickSprint } from "@/lib/quote-estimator";
import type { QuoteContext } from "@/types/quote";

export type QuickQuoteModalProps = {
  context: QuoteContext | null;
  onClose: () => void;
};

export function QuickQuoteModal({ context, onClose }: QuickQuoteModalProps) {
  const title = context
    ? context.engagementType === "quick-sprint"
      ? "Request a Sprint"
      : "Request a Custom Quote"
    : "";

  const summaryLines = context
    ? context.quickSprint
      ? summarizeQuickSprint(context.quickSprint)
      : context.project
        ? summarizeProject(context.project)
        : []
    : [];

  return (
    <Modal open={context !== null} onClose={onClose} title={title}>
      {context && (
        <>
          <div className="mb-6 neo-border bg-background p-4">
            <p className="font-retro text-base tracking-wide text-accent-secondary">
              {context.engagementType === "quick-sprint"
                ? "QUICK SPRINT"
                : "FULL BUILD"}
            </p>
            <p className="mt-1 font-sans font-semibold">
              {context.estimate.headline}
            </p>
            <ul className="mt-3 space-y-1">
              {summaryLines.map((line) => (
                <li key={line} className="font-sans text-sm text-muted">
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <ContactForm context={context} />
        </>
      )}
    </Modal>
  );
}
