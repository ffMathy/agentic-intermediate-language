import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { Stack } from "../../parts/stack";
import { ReadersTree } from "./readers-tree";

type Reader = "stakeholder" | "design" | "engineer" | "specialist";

const ORDER: Reader[] = ["stakeholder", "design", "engineer", "specialist"];

const READERS: Record<
  Reader,
  { name: string; level: string; text: string; cmd: string; color: string }
> = {
  stakeholder: {
    name: "Stakeholder",
    level: "PRODUCT LEVEL",
    text: "Reads the six promises at the top of the tree, and can sign off on “The computer never loses.” without reading any code.",
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
    text: "Reads the types, the contracts and the examples that run as tests, such as evaluate(boardFrom(\"XOX/XOO/OXX\")) => ({ kind: \"draw\" }).",
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

/** four tabs, "Stakeholder", "Design", "Engineer" and "Specialist", named together as "Readers"; "Stakeholder" is picked first */
export function Readers() {
  const [reader, setReader] = useState<Reader>("stakeholder");
  const tabRefs = useRef<Record<Reader, HTMLButtonElement | null>>({
    stakeholder: null,
    design: null,
    engineer: null,
    specialist: null,
  });

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, key: Reader) => {
    const index = ORDER.indexOf(key);
    let next: Reader | null = null;
    if (event.key === "ArrowRight") {
      next = ORDER[(index + 1) % ORDER.length];
    } else if (event.key === "ArrowLeft") {
      next = ORDER[(index - 1 + ORDER.length) % ORDER.length];
    }
    if (next !== null) {
      setReader(next);
      tabRefs.current[next]?.focus();
    }
  };

  const current = READERS[reader];

  return (
    <Section id="readers" tone="raised">
      <SectionHeading
        text="One spec, four readers"
        lead="Nobody reads the whole tree. ail show renders it for each audience, and each reader stops where the detail stops mattering to them."
      />
      <div role="tablist" aria-label="Readers">
        <Stack dir="h" gap="space.2" align="center" wrap={true}>
          {ORDER.map((key) => {
            const picked = key === reader;
            const color = READERS[key].color;
            return (
              <button
                key={key}
                ref={(element) => {
                  tabRefs.current[key] = element;
                }}
                type="button"
                role="tab"
                id={`reader-tab-${key}`}
                aria-selected={picked}
                aria-controls="reader-panel"
                tabIndex={picked ? 0 : -1}
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
                  background: picked ? color : "var(--color-surface)",
                  border: picked
                    ? `1px solid ${color}`
                    : "1px solid var(--color-border)",
                  color: picked
                    ? "var(--color-on-accent)"
                    : "var(--color-text)",
                }}
              >
                {READERS[key].name}
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
              color: current.color,
            }}
          >
            {current.level}
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
            {current.text}
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
            {current.cmd}
          </code>
          <ReadersTree reader={reader} />
        </Stack>
      </div>
    </Section>
  );
}
