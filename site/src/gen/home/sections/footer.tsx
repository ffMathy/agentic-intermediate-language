import { Stack, Text } from "../../catalog";

/** Footer: one row of three links, separated by space. */
export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--color-border)" }}>
      <Stack dir="h" gap="space.4" align="center" pad="space.6">
        <a href="https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/proposal.md" style={{ color: "var(--color-text-muted)" }}>
          <Text variant="body">Design</Text>
        </a>
        <a href="https://github.com/ffMathy/agentic-intermediate-language" style={{ color: "var(--color-text-muted)" }}>
          <Text variant="body">Source</Text>
        </a>
        <a href="https://github.com/ffMathy/agentic-intermediate-language/tree/main/examples/tictactoe" style={{ color: "var(--color-text-muted)" }}>
          <Text variant="body">Demo spec</Text>
        </a>
      </Stack>
    </footer>
  );
}
