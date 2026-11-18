import { Stack, Text } from "../../catalog";

/** Hero: shows the name, the pitch, one sentence of explanation, and three links. */
export function Hero() {
  return (
    <Stack dir="v" gap="space.4" align="start" pad="space.8">
      <h1 style={{ fontSize: "var(--font-hero)", fontWeight: 800, color: "var(--color-accent)", margin: 0 }}>AIL</h1>
      <span style={{ fontSize: "var(--font-heading)", fontWeight: 600, color: "var(--color-text)" }}>
        Write the spec. Let agents build the code. Prove that they agree.
      </span>
      <span style={{ color: "var(--color-text-muted)", maxWidth: "640px" }}>
        <Text variant="body">
          AIL is a recursive why / what / how specification. People review the spec; any model compiles it; every check it implies runs against the result.
        </Text>
      </span>
      <Stack dir="h" gap="space.4" align="center">
        <a
          href="#get-started"
          style={{
            padding: "var(--space-2) var(--space-4)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--font-body)",
            fontWeight: 600,
            textDecoration: "none",
            background: "var(--color-action)",
            color: "var(--color-action-text)",
            border: "1px solid var(--color-action)",
          }}
        >
          Get started
        </a>
        <a
          href="./demo/"
          style={{
            padding: "var(--space-2) var(--space-4)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--font-body)",
            fontWeight: 600,
            textDecoration: "none",
            background: "var(--color-surface)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
          }}
        >
          Try the demo
        </a>
        <a
          href="https://github.com/ffMathy/agentic-intermediate-language"
          style={{
            padding: "var(--space-2) var(--space-4)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--font-body)",
            fontWeight: 600,
            textDecoration: "none",
            background: "var(--color-surface)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
          }}
        >
          GitHub
        </a>
      </Stack>
    </Stack>
  );
}
