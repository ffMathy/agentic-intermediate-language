import { useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { Stack } from "../../parts/stack";
import { ReadersTree } from "./readers-tree";

type Reader = "stakeholder" | "design" | "engineer" | "specialist";

const readers: Reader[] = ["stakeholder", "design", "engineer", "specialist"];

const names: Record<Reader, string> = {
  stakeholder: "Stakeholder",
  design: "Design",
  engineer: "Engineer",
  specialist: "Specialist",
};

const levels: Record<Reader, string> = {
  stakeholder: "PRODUCT LEVEL",
  design: "EXPERIENCE LEVEL",
  engineer: "SYSTEM LEVEL",
  specialist: "SPECIALIST LEVEL",
};

const texts: Record<Reader, string> = {
  stakeholder:
    "Reads the six promises at the top and the scenarios under them in plain words, and can sign off on “The computer never loses.” without reading any code.",
  design:
    "Reads the scenarios, the layout in design tokens, and every word on screen, such as “X's turn”, “X wins!” and “New game”.",
  engineer:
    "Reads everything down to the contracts, with the specialists' how folded away: the types, and the examples that run as tests, such as evaluate(boardFrom(\"XOX/XOO/OXX\")) => ({ kind: \"draw\" }).",
  specialist:
    "Reads the algorithm, its invariant and how it is proved: full minimax, memoized by board, checked against every possible game.",
};

const colors: Record<Reader, string> = {
  stakeholder: "var(--color-level-product)",
  design: "var(--color-level-experience)",
  engineer: "var(--color-level-system)",
  specialist: "var(--color-level-specialist)",
};

const tabBase: CSSProperties = {
  height: "40px",
  padding: "0 var(--space-4)",
  borderRadius: "var(--radius-md)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--font-small)",
  fontWeight: 600,
  cursor: "pointer",
};

const otherStyle: CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text)",
};

const panelStyle: CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-lg)",
  padding: "var(--space-6)",
};

const textStyle: CSSProperties = {
  fontSize: "var(--font-lead)",
  lineHeight: 1.6,
  color: "var(--color-text)",
  maxWidth: "var(--width-prose)",
  margin: 0,
};

/** Each level of the tree is written for one kind of reader, and each reader's view goes only as deep as they need. */
export function Readers() {
  const [reader, setReader] = useState<Reader>("stakeholder");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1;
    if (event.key === "ArrowRight") {
      next = (index + 1) % readers.length;
    } else if (event.key === "ArrowLeft") {
      next = (index - 1 + readers.length) % readers.length;
    }
    if (next < 0) {
      return;
    }
    event.preventDefault();
    setReader(readers[next]);
    tabRefs.current[next]?.focus();
  };

  return (
    <Section id="readers" tone="raised">
      <SectionHeading
        text="One spec, four readers"
        lead="Each level of the tree is written for one kind of reader. Pick a reader to see which level is theirs: they start at the top and stop where the detail stops mattering to them."
      />
      <div role="tablist" aria-label="Readers">
        <Stack dir="h" gap="space.2" align="center" wrap={true}>
          {readers.map((key, index) => {
            const picked = key === reader;
            const style: CSSProperties = picked
              ? {
                  ...tabBase,
                  background: colors[key],
                  border: `1px solid ${colors[key]}`,
                  color: "var(--color-on-accent)",
                }
              : { ...tabBase, ...otherStyle };
            return (
              <button
                key={key}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`reader-tab-${key}`}
                aria-selected={picked}
                aria-controls="reader-panel"
                tabIndex={picked ? 0 : -1}
                style={style}
                onClick={() => setReader(key)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                {names[key]}
              </button>
            );
          })}
        </Stack>
      </div>
      <div
        role="tabpanel"
        id="reader-panel"
        aria-labelledby={`reader-tab-${reader}`}
        style={panelStyle}
      >
        <Stack dir="v" gap="space.4" align="stretch">
          <div
            style={{
              fontSize: "var(--font-micro)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: colors[reader],
            }}
          >
            {levels[reader]}
          </div>
          <p style={textStyle}>{texts[reader]}</p>
          <ReadersTree reader={reader} />
        </Stack>
      </div>
    </Section>
  );
}
