import type { CSSProperties } from "react";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { Stack } from "../../parts/stack";
import { LoopFigure } from "./loop-figure";

const steps: { n: string; title: string; text: string; color: string }[] = [
  {
    n: "1",
    title: "Write",
    text: "Change the spec, in plain words or with Claude Code's help. Generated code is never edited by hand.",
    color: "var(--color-level-product)",
  },
  {
    n: "2",
    title: "Build",
    text: "ail build recompiles only the nodes whose spec changed. Each node is compiled by an agent that sees only its own slice of the tree.",
    color: "var(--color-level-build)",
  },
  {
    n: "3",
    title: "Check",
    text: "ail check lints the spec, confirms every file was built from it, and runs every example, scenario and verify line as a test.",
    color: "var(--color-step-check)",
  },
  {
    n: "4",
    title: "Ask",
    text: "When the spec leaves a gap, the compiler doesn't guess. It replies STOP with a question, and the answer goes into the spec.",
    color: "var(--color-level-experience)",
  },
];

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
  gap: "var(--space-8)",
  alignItems: "center",
};

const stepsStyle: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-4)",
};

const stepStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  gap: "var(--space-3)",
  alignItems: "flex-start",
};

const numberStyle: CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "var(--radius-pill)",
  flex: "0 0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "var(--font-small)",
  fontWeight: 800,
  color: "var(--color-on-accent)",
};

const wordsStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-1)",
};

const titleStyle: CSSProperties = {
  fontSize: "var(--font-lead)",
  fontWeight: 700,
  color: "var(--color-text)",
  margin: 0,
};

const textStyle: CSSProperties = {
  fontSize: "var(--font-body)",
  lineHeight: 1.6,
  color: "var(--color-text-muted)",
  margin: 0,
};

const stopStyle: CSSProperties = {
  background: "var(--color-stop-soft)",
  border: "1px solid var(--color-level-experience)",
  borderRadius: "var(--radius-md)",
  padding: "var(--space-4)",
};

const questionStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-code)",
  color: "var(--color-text)",
  margin: 0,
};

const wordStyle: CSSProperties = {
  fontWeight: 700,
  color: "var(--color-stop-text)",
};

const noteStyle: CSSProperties = {
  fontSize: "var(--font-small)",
  color: "var(--color-text-muted)",
  margin: "var(--space-2) 0 0",
};

/** "a heading, a loop picture beside four numbered steps, and an example of a question the compiler asks instead of guessing" */
export function BuildLoop() {
  return (
    <Section id="loop" tone="plain">
      <Stack dir="v" gap="space.8" align="stretch">
        <SectionHeading
          text="How a spec becomes code you can trust"
          lead="Four steps, repeated for every change. You only ever edit the spec."
        />
        <div style={gridStyle}>
          <LoopFigure />
          <ol style={stepsStyle}>
            {steps.map((step) => (
              <li key={step.n} style={stepStyle}>
                <span style={{ ...numberStyle, background: step.color }}>{step.n}</span>
                <div style={wordsStyle}>
                  <h3 style={titleStyle}>{step.title}</h3>
                  <p style={textStyle}>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div style={stopStyle}>
          <p style={questionStyle}>
            <span style={wordStyle}>{"STOP:"}</span>
            {" after switching to the computer, does “New game” keep the computer as the opponent?"}
          </p>
          <p style={noteStyle}>
            {"Illustrative example. The real spec answers it in GameReducer: newGame → initial(game.opponent)."}
          </p>
        </div>
      </Stack>
    </Section>
  );
}
