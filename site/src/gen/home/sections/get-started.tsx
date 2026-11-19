import { useId } from "react";
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

const commands = [
  {
    command: "ail check",
    does: "Is the spec sound, is the code built from it, and does it pass every check?",
  },
  {
    command: "ail build",
    does: "Compile whatever changed.",
  },
  {
    command: "ail show [what]",
    does: "The tree, a node, one reader's view, or what changed.",
  },
];

/** "two cards, "In Claude Code" and "In a terminal", side by side when there is room" */
export function GetStarted() {
  const claudeTitleId = useId();
  const cliTitleId = useId();
  return (
    <Section id="start" tone="raised">
      <SectionHeading text="Start in two minutes" />
      <div style={cardsStyle}>
        <div role="region" aria-labelledby={claudeTitleId} style={cardStyle}>
          <Stack dir="v" gap="space.3" align="stretch">
            <h3 id={claudeTitleId} style={titleStyle}>
              In Claude Code
            </h3>
            <p style={subtitleStyle}>
              No API key. It runs on your Claude subscription.
            </p>
            <CopyCommand command="/plugin marketplace add ffMathy/agentic-intermediate-language" />
            <CopyCommand command="/plugin install ail@agentic-intermediate-language" />
            <p style={textStyle}>
              Then ask for features in plain words. Claude changes the spec, and /ail:build compiles whatever changed.
            </p>
          </Stack>
        </div>
        <div role="region" aria-labelledby={cliTitleId} style={cardStyle}>
          <Stack dir="v" gap="space.3" align="stretch">
            <h3 id={cliTitleId} style={titleStyle}>
              In a terminal
            </h3>
            <p style={subtitleStyle}>Needs Bun 1.2 or later.</p>
            <CopyCommand command="bun add -g github:ffMathy/agentic-intermediate-language" />
            <table style={tableStyle}>
              <thead>
                <tr style={rowStyle}>
                  <th scope="col" style={cellStyle}>
                    Command
                  </th>
                  <th scope="col" style={cellStyle}>
                    What it does
                  </th>
                </tr>
              </thead>
              <tbody>
                {commands.map((row) => (
                  <tr key={row.command} style={rowStyle}>
                    <td style={commandCellStyle}>{row.command}</td>
                    <td style={cellStyle}>{row.does}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={closingStyle}>That's the whole tool: three commands.</p>
          </Stack>
        </div>
      </div>
    </Section>
  );
}
