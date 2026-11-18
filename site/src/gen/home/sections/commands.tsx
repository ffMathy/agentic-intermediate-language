import { Stack, Text } from "../../catalog";
import { SectionHeading } from "../../parts/section-heading";

const rowStyle = { borderBottom: "1px solid var(--color-border)" };

const cellStyle = {
  padding: "var(--space-2) var(--space-4)",
  verticalAlign: "top",
};

const headerStyle = { ...cellStyle, fontWeight: 700, textAlign: "left" as const };

const commandStyle = {
  ...cellStyle,
  fontSize: "var(--font-code)",
  fontFamily: "monospace",
  color: "var(--color-accent)",
  whiteSpace: "nowrap" as const,
};

const rows = [
  {
    command: "ail check",
    does: "Is the spec sound, is the code built from it, and does the code pass every check the spec implies?",
  },
  {
    command: "ail build",
    does: "Compile whatever changed, through Claude Code or any model, and reject anything that fails its checks.",
  },
  {
    command: "ail show",
    does: "The tree, a single node, a view for one audience, or what changed, ready for review.",
  },
];

/** Commands: a heading, then a table with a header row and one row per command: the command, and what it does. */
export function Commands() {
  return (
    <Stack dir="v" gap="space.4" align="stretch">
      <SectionHeading text="Three commands" />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={rowStyle}>
            <th style={headerStyle}>
              <Text variant="body">Command</Text>
            </th>
            <th style={headerStyle}>
              <Text variant="body">What it does</Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.command} style={rowStyle}>
              <td style={commandStyle}>{row.command}</td>
              <td style={cellStyle}>{row.does}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Stack>
  );
}
