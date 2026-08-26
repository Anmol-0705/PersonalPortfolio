"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { runTerminalCommand } from "@/components/terminal/terminal-commands";
import type { TerminalOutputLine } from "@/components/terminal/terminal-commands";
import type { Project } from "@/types/project";

const WELCOME_LINES: TerminalOutputLine[] = [
  { text: "Welcome to Anmol's interactive terminal.", tone: "accent" },
  { text: 'Type "help" to explore.', tone: "muted" },
];

const TONE_CLASSES: Record<NonNullable<TerminalOutputLine["tone"]>, string> = {
  default: "text-foreground",
  muted: "text-muted",
  accent: "text-crt-green",
  error: "text-hot-pink",
};

function OutputLine({ line }: { line: TerminalOutputLine }) {
  const toneClass = TONE_CLASSES[line.tone ?? "default"];

  if (line.href) {
    const linkClass = cn(
      toneClass,
      "underline decoration-2 underline-offset-4 hover:text-accent-secondary focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2",
    );

    return (
      <p>
        {line.href.startsWith("/") ? (
          <Link href={line.href} className={linkClass}>
            {line.text}
          </Link>
        ) : (
          <a href={line.href} className={linkClass}>
            {line.text}
          </a>
        )}
      </p>
    );
  }

  return <p className={cn(toneClass, "whitespace-pre-wrap")}>{line.text || " "}</p>;
}

export type TerminalProps = {
  projects: Project[];
};

export function Terminal({ projects }: TerminalProps) {
  const router = useRouter();
  const [entries, setEntries] = useState<TerminalOutputLine[]>(WELCOME_LINES);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [entries]);

  // The host Modal focuses its own first focusable element (its close
  // button) on open. Deferring to the next frame lets that run first,
  // then moves focus to the command input as the spec requires.
  useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = inputValue.trim();
    if (!command) return;

    setCommandHistory((previous) => [...previous, command]);
    setHistoryIndex(null);

    const result = runTerminalCommand(command, { projects });
    const echo: TerminalOutputLine = { text: `> ${command}`, tone: "accent" };

    if (result.action === "clear") {
      setEntries([]);
    } else if (result.action === "navigate") {
      setEntries((previous) => [...previous, echo, ...(result.lines ?? [])]);
      router.push(result.href);
    } else {
      setEntries((previous) => [...previous, echo, ...result.lines]);
    }

    setInputValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex =
        historyIndex === null
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputValue(commandHistory[nextIndex]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(null);
        setInputValue("");
      } else {
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex]);
      }
    }
  }

  return (
    <div className="font-retro text-lg">
      <div
        ref={outputRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="h-72 overflow-y-auto border-2 border-border bg-background p-3 sm:h-80"
      >
        {entries.map((entry, index) => (
          <OutputLine key={index} line={entry} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
        <label htmlFor="terminal-input" className="sr-only">
          Terminal command input
        </label>
        <span aria-hidden="true" className="text-crt-green">
          &gt;
        </span>
        <input
          ref={inputRef}
          id="terminal-input"
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type a command..."
          className="w-full border-0 border-b-2 border-border bg-transparent px-1 py-1 font-retro text-lg text-foreground placeholder:text-muted focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
        />
      </form>
    </div>
  );
}
