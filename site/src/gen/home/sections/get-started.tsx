import type { CSSProperties } from "react";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { Stack } from "../../parts/stack";
import { CopyCommand } from "../../parts/copy-command";

const cardsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
  gap: "var(--space-6)",
  alignItems: "start",
};

const cardStyle: CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-lg)",
  padding: "var(--space-6)",
  minWidth: 0,
};

const titleStyle: CSSProperties = {
  fontSize: "var(--font-lead)",
  fontWeight: 700,
  color: "var(--color-text)",
  margin: 0,
};

const subtitleStyle: CSSProperties = {
  fontSize: "var(--font-small)",
  color: "var(--color-text-muted)",
  margin: 0,
};

const textStyle: CSSProperties = {
  fontSize: "var(--font-body)",
  lineHeight: 1.6,
  color: "var(--color-text-muted)",
  margin: 0,
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const rowStyle: CSSProperties = {
  borderBottom: "1px solid var(--color-border)",
};

const cellStyle: CSSProperties = {
  padding: "var(--space-2) var(--space-2) var(--space-2) 0",
  verticalAlign: "top",
  fontSize: "var(--font-small)",
  textAlign: "left",
};

const commandCellStyle: CSSProperties = {
  ...cellStyle,
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-code)",
  fontWeight: 600,
  color: "var(--color-accent)",
  whiteSpace: "nowrap",
};

const closingStyle: CSSProperties = {
  fontSize: "var(--font-small)",
  fontWeight: 600,
  color: "var(--color-text)",
  margin: 0,
};

const exampleStyle: CSSProperties = {
  background: "var(--color-accent)",
  color: "var(--color-on-accent)",
  border: "2px solid var(--color-accent)",
  borderRadius: "var(--radius-md)",
  padding: "var(--space-3) var(--space-6)",
  fontWeight: 700,
  textDecoration: "none",
};

const repoStyle: CSSProperties = {
  background: "var(--color-surface)",
  color: "var(--color-accent)",
  border: "2px solid var(--color-accent)",
  borderRadius: "var(--radius-md)",
  padding: "var(--space-3) var(--space-6)",
  fontWeight: 700,
  textDecoration: "none",
};

const tools: ReadonlyArray<{ command: string; does: string }> = [
  {
    command: "ail check",
    does: "Is the spec sound, is the code built from it, and does it pass every check?",
  },
  { command: "ail build", does: "Compile whatever changed." },
  {
    command: "ail show [what]",
    does: "The tree, a node, one reader's view, or what changed.",
  },
];

/** Two cards, "In Claude Code" and "In a terminal", side by side when there is room, then links to what to read or try next. */
export function GetStarted() {
  return (
    <Section id="start" tone="plain">
      <Stack dir="v" gap="space.6" align="stretch">
        <SectionHeading
          text="Start in two minutes"
          lead="Install it, then describe a feature in plain words. You get a spec you can review, and code that is checked against it."
        />
        <div style={cardsStyle}>
          <div role="region" aria-label="In Claude Code" style={cardStyle}>
            <Stack dir="v" gap="space.3" align="stretch">
              <h3 style={titleStyle}>In Claude Code</h3>
              <p style={subtitleStyle}>No API key. It runs on your Claude subscription.</p>
              <CopyCommand command="/plugin marketplace add ffMathy/agentic-intermediate-language" />
              <CopyCommand command="/plugin install ail@agentic-intermediate-language" />
              <p style={textStyle}>
                Then ask for features in plain words. Claude changes the spec, and /ail:build compiles whatever changed.
              </p>
            </Stack>
          </div>
          <div role="region" aria-label="In a terminal" style={cardStyle}>
            <Stack dir="v" gap="space.3" align="stretch">
              <h3 style={titleStyle}>In a terminal</h3>
              <p style={subtitleStyle}>Needs Bun 1.2 or later.</p>
              <CopyCommand command="bun add -g github:ffMathy/agentic-intermediate-language" />
              <table style={tableStyle}>
                <thead>
                  <tr style={rowStyle}>
                    <th style={cellStyle}>Command</th>
                    <th style={cellStyle}>What it does</th>
                  </tr>
                </thead>
                <tbody>
                  {tools.map((tool) => (
                    <tr key={tool.command} style={rowStyle}>
                      <td style={commandCellStyle}>{tool.command}</td>
                      <td style={cellStyle}>{tool.does}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={closingStyle}>That's the whole tool: three commands.</p>
              <p style={textStyle}>
                Run these inside a project, meaning any folder with an ail.config.json. To try the tic-tac-toe demo from this page:
              </p>
              <CopyCommand command="git clone https://github.com/ffMathy/agentic-intermediate-language && cd agentic-intermediate-language" />
              <CopyCommand command="bun install && bun link" />
              <CopyCommand command="cd examples/tictactoe && bun install && ail check" />
              <CopyCommand command="ail show stakeholder" />
            </Stack>
          </div>
        </div>
        <Stack dir="h" gap="space.3" align="center" wrap={true}>
          <a
            href="https://github.com/ffMathy/agentic-intermediate-language/tree/main/examples/tictactoe"
            style={exampleStyle}
          >
            Read the Tic-Tac-Toe spec
          </a>
          <a href="https://github.com/ffMathy/agentic-intermediate-language" style={repoStyle}>
            View on GitHub ↗
          </a>
        </Stack>
      </Stack>
    </Section>
  );
}
