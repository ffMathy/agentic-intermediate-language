import type { CSSProperties } from "react";
import { Stack } from "../../parts/stack";

const steps: { n: string; title: string; text: string; color: string }[] = [
  {
    n: "1",
    title: "Write",
    text: "Change the spec, in plain words or with the help of Claude Code, Cursor or Copilot. Generated code is never edited by hand.",
    color: "var(--color-thread)",
  },
  {
    n: "2",
    title: "Build",
    text: "ail build recompiles only the nodes whose slice changed: their own spec, the contracts of the nodes they use, or shared parts like the tokens. Each node is compiled by an agent that sees only that slice.",
    color: "var(--color-dot-amber)",
  },
  {
    n: "3",
    title: "Check",
    text: "Every build ends by checking: it lints the spec, confirms every file was built from it, runs every example, scenario and verify line as a test, and has a model compare each screen with its look.",
    color: "var(--color-dot-green)",
  },
  {
    n: "4",
    title: "Ask",
    text: "When the spec leaves a gap, the compiler doesn't guess. It replies STOP with a question, and the answer goes into the spec.",
    color: "var(--color-dot-red)",
  },
];

const bandStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "var(--color-code)",
  color: "var(--color-code-text)",
  paddingTop: "var(--space-16)",
  paddingBottom: "var(--space-16)",
  paddingLeft: "var(--space-4)",
  paddingRight: "var(--space-4)",
  scrollMarginTop: "var(--space-4)",
};

const columnStyle: CSSProperties = {
  maxWidth: "var(--width-content)",
  margin: "0 auto",
  width: "100%",
};

const eyebrowStyle: CSSProperties = {
  fontSize: "var(--font-tiny)",
  fontWeight: 700,
  letterSpacing: "0.12em",
  color: "var(--color-dot-amber)",
  margin: 0,
};

const headingStyle: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--font-heading)",
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: "-0.01em",
  color: "var(--color-code-text)",
  margin: 0,
};

const leadStyle: CSSProperties = {
  fontSize: "var(--font-lead)",
  lineHeight: 1.6,
  color: "var(--color-code-muted)",
  maxWidth: "var(--width-prose)",
  margin: 0,
};

const stepsStyle: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
  gap: "var(--space-4)",
};

const stepStyle: CSSProperties = {
  border: "1px solid var(--color-code-border)",
  borderRadius: "var(--radius-lg)",
  padding: "var(--space-6)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-2)",
};

const numberStyle: CSSProperties = {
  display: "block",
  fontFamily: "var(--font-display)",
  fontSize: "40px",
  fontWeight: 800,
  lineHeight: 1,
};

const titleStyle: CSSProperties = {
  fontSize: "var(--font-lead)",
  fontWeight: 700,
  color: "var(--color-code-text)",
  margin: 0,
};

const textStyle: CSSProperties = {
  fontSize: "var(--font-body)",
  lineHeight: 1.6,
  color: "var(--color-code-muted)",
  margin: 0,
};

const stopStyle: CSSProperties = {
  background: "var(--color-code-pick)",
  border: "1px solid var(--color-code-border)",
  borderRadius: "var(--radius-md)",
  padding: "var(--space-4)",
};

const questionStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-code)",
  color: "var(--color-code-text)",
  margin: 0,
};

const wordStyle: CSSProperties = {
  fontWeight: 700,
  color: "var(--color-dot-amber)",
};

const noteStyle: CSSProperties = {
  fontSize: "var(--font-small)",
  color: "var(--color-code-muted)",
  margin: "var(--space-2) 0 0",
};

/** "a dark band, like the code panels, with a heading, four numbered steps side by side when there is room, and an example of a question the compiler asks instead of guessing" */
export function BuildLoop() {
  return (
    <section id="loop" style={bandStyle}>
      <div style={columnStyle}>
        <Stack dir="v" gap="space.8" align="stretch">
          <Stack dir="v" gap="space.3" align="start">
            <p style={eyebrowStyle}>HOW IT BUILDS</p>
            <h2 style={headingStyle}>How a spec becomes code you can trust</h2>
            <p style={leadStyle}>
              Four steps, repeated for every change. You only ever edit the spec.
            </p>
          </Stack>
          <ol style={stepsStyle}>
            {steps.map((step) => (
              <li key={step.n} style={stepStyle}>
                <span style={{ ...numberStyle, color: step.color }}>{step.n}</span>
                <h3 style={titleStyle}>{step.title}</h3>
                <p style={textStyle}>{step.text}</p>
              </li>
            ))}
          </ol>
          <div style={stopStyle}>
            <p style={questionStyle}>
              <span style={wordStyle}>STOP:</span>
              {" after switching to the computer, does “New game” keep the computer as the opponent?"}
            </p>
            <p style={noteStyle}>
              Example question. In the real Tic-Tac-Toe spec the answer is already written down: “New game” keeps the opponent you chose (see the GameReducer node).
            </p>
          </div>
        </Stack>
      </div>
    </section>
  );
}
