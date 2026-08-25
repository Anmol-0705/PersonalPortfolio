import Link from "next/link";
import { neoButtonClasses } from "@/components/ui/neo-button";

export function CtaSection() {
  return (
    <section className="scanlines bg-accent">
      <div className="container-app py-20 text-center sm:py-28">
        <h2 className="font-sans text-3xl font-bold text-off-white sm:text-5xl">
          Have an idea? Let&rsquo;s turn it into something real.
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-sans text-lg text-off-white/80">
          Whether you need a focused development sprint or a complete
          product built from the ground up, let&rsquo;s talk about what
          you&rsquo;re building and how I can help.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className={neoButtonClasses(
              "secondary",
              "bg-off-white text-pure-black",
            )}
          >
            Start a Conversation
          </Link>
          <Link
            href="/projects"
            className={neoButtonClasses(
              "ghost",
              "border-off-white! text-off-white hover:bg-off-white/10!",
            )}
          >
            View My Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
