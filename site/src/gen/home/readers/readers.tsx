import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { Stack } from "../../parts/stack";
import { ReadersTree } from "./readers-tree";

type Reader = "stakeholder" | "design" | "engineer" | "specialist";

const order: Reader[] = ["stakeholder", "design", "engineer", "specialist"];

const content: Record<
  Reader,
  { name: string; level: string; text: string; cmd: string; color: string }
> = {
  stakeholder: {
    name: "Stakeholder",
    level: "PRODUCT LEVEL",
    text: "Reads the six promises at the top and the scenarios under them in plain words, and can sign off on “The computer never loses.” without reading any code.",
    cmd: "ail show stakeholder",
    color: "var(--color-level-product)",
  },
  design: {
    name: "Design",
    level: "EXPERIENCE LEVEL",
    text: "Reads the scenarios, the layout in design tokens, and every word on screen, such as “X's turn”, “X wins!” and “New game”.",
    cmd: "ail show design",
    color: "var(--color-level-experience)",
  },
  engineer: {
    name: "Engineer",
    level: "SYSTEM LEVEL",
    text: "Reads everything down to the contracts, with the specialists' how folded away: the types, and the examples that run as tests, such as evaluate(boardFrom(\"XOX/XOO/OXX\")) => ({ kind: \"draw\" }).",
    cmd: "ail show engineer",
    color: "var(--color-level-system)",
  },
  specialist: {
    name: "Specialist",
    level: "SPECIALIST LEVEL",
    text: "Reads the algorithm, its invariant and how it is proved: full minimax, memoized by board, checked against every possible game.",
    cmd: "ail show specialist ai",
    color: "var(--color-level-specialist)",
  },
};

/** Explain why levels exist: each level of the tree is written for one kind of reader, and each reader's view goes only as deep as they need. */
export function Readers() {
  const [reader, setReader] = useState<Reader>("stakeholder");
  const tabRefs = useRef<Record<Reader, HTMLButtonElement | null>>({
    stakeholder: null,
    design: null,
    engineer: null,
    specialist: null,
  });

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, key: Reader) => {
    const index = order.indexOf(key);
    let next: Reader | null = null;
    if (event.key === "ArrowRight") {
      next = order[(index + 1) % order.length];
    } else if (event.key === "ArrowLeft") {
      next = order[(index - 1 + order.length) % order.length];
    }
    if (next !== null) {
      event.preventDefault();
      setReader(next);
      tabRefs.current[next]?.focus();
    }
  };

  const picked = content[reader];

  return (
    <Section id="readers" tone="raised">
      <SectionHeading
        text="One spec, four readers"
        lead="Each level of the tree is written for one kind of reader. Pick a reader to see which level is theirs, and the ail show command that renders their view: it starts at the top and goes as deep as that reader needs."
      />
      <div role="tablist" aria-label="Readers">
        <Stack dir="h" gap="space.2" align="center" wrap={true}>
          {order.map((key) => {
            const isPicked = key === reader;
            const c = content[key];
            return (
              <button
                key={key}
                type="button"
                ref={(el) => {
                  tabRefs.current[key] = el;
                }}
                role="tab"
                id={`reader-tab-${key}`}
                aria-selected={isPicked}
                aria-controls="reader-panel"
                tabIndex={isPicked ? 0 : -1}
                onClick={() => setReader(key)}
                onKeyDown={(event) => onKeyDown(event, key)}
                style={{
                  height: "40px",
                  padding: "0 var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--font-small)",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: isPicked ? c.color : "var(--color-surface)",
                  border: isPicked
                    ? `1px solid ${c.color}`
                    : "1px solid var(--color-border)",
                  color: isPicked
                    ? "var(--color-on-accent)"
                    : "var(--color-text)",
                }}
              >
                {c.name}
              </button>
            );
          })}
        </Stack>
      </div>
      <div
        role="tabpanel"
        id="reader-panel"
        aria-labelledby={`reader-tab-${reader}`}
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-6)",
        }}
      >
        <Stack dir="v" gap="space.4" align="stretch">
          <div
            style={{
              fontSize: "var(--font-micro)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: picked.color,
            }}
          >
            {picked.level}
          </div>
          <p
            style={{
              fontSize: "var(--font-lead)",
              lineHeight: 1.6,
              color: "var(--color-text)",
              maxWidth: "var(--width-prose)",
              margin: 0,
            }}
          >
            {picked.text}
          </p>
          <code
            style={{
              alignSelf: "flex-start",
              background: "var(--color-code)",
              color: "var(--color-code-text)",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--font-code)",
              borderRadius: "var(--radius-sm)",
              padding: "var(--space-1) var(--space-2)",
            }}
          >
            {picked.cmd}
          </code>
          <ReadersTree reader={reader} />
        </Stack>
      </div>
    </Section>
  );
}
