import { Stack, Text } from "../../catalog";
import { SectionHeading } from "../../parts/section-heading";
import { CodeBlock } from "../../parts/code-block";

/** GetStarted: two options, "In Claude Code" and "In a terminal", side by side when there is room. */
export function GetStarted() {
  return (
    <Stack dir="v" gap="space.4" align="stretch">
      <SectionHeading text="Get started" id="get-started" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <div
          style={{
            background: "var(--color-surface-raised)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-4)",
          }}
        >
          <Stack dir="v" gap="space.2" align="stretch">
            <span style={{ fontWeight: 700 }}>
              <Text variant="body">In Claude Code</Text>
            </span>
            <span style={{ color: "var(--color-text-muted)" }}>
              <Text variant="body">No API key needed: it runs on your Claude subscription.</Text>
            </span>
            <CodeBlock
              label="Claude Code commands"
              lines={[
                "/plugin marketplace add ffMathy/agentic-intermediate-language",
                "/plugin install ail@agentic-intermediate-language",
                "/ail:build",
              ]}
            />
          </Stack>
        </div>
        <div
          style={{
            background: "var(--color-surface-raised)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-4)",
          }}
        >
          <Stack dir="v" gap="space.2" align="stretch">
            <span style={{ fontWeight: 700 }}>
              <Text variant="body">In a terminal</Text>
            </span>
            <span style={{ color: "var(--color-text-muted)" }}>
              <Text variant="body">Needs Bun. Uses your Claude Code login, or ANTHROPIC_API_KEY when it is set.</Text>
            </span>
            <CodeBlock
              label="Terminal commands"
              lines={[
                "bun add -g github:ffMathy/agentic-intermediate-language",
                "ail check",
                "ail build",
                "ail show",
              ]}
            />
          </Stack>
        </div>
      </div>
    </Stack>
  );
}
