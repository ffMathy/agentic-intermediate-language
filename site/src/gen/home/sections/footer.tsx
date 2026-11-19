import { Stack } from "../../parts/stack";

const linkStyle = {
  color: "var(--color-code-text)",
  fontWeight: 600,
  textDecoration: "underline",
};

const stripColors = [
  "var(--color-level-product)",
  "var(--color-level-experience)",
  "var(--color-level-system)",
  "var(--color-level-specialist)",
];

/** "a strip of the four level colors, one sentence on where this page and the game came from, and four links" */
export function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-code)",
        color: "var(--color-code-muted)",
        fontSize: "var(--font-small)",
      }}
    >
      <div style={{ height: "4px", display: "flex" }}>
        {stripColors.map((color) => (
          <div key={color} style={{ flex: 1, background: color }} />
        ))}
      </div>
      <Stack
        dir="v"
        gap="space.4"
        align="start"
        style={{
          maxWidth: "var(--width-content)",
          margin: "0 auto",
          boxSizing: "content-box",
          padding: "var(--space-8) var(--space-4)",
        }}
      >
        <p
          style={{
            lineHeight: 1.6,
            maxWidth: "var(--width-prose)",
            margin: 0,
          }}
        >
          Brewed in AIL. This page was compiled from the spec in site/ail/, and the game from the spec in examples/tictactoe/ail/. Apart from the spec and a short index.html, nothing in either was written by hand.
        </p>
        <nav aria-label="More about AIL">
          <Stack dir="h" gap="space.4" align="center" wrap={true}>
            <a href="https://github.com/ffMathy/agentic-intermediate-language" style={linkStyle}>
              GitHub
            </a>
            <a
              href="https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/proposal.md"
              style={linkStyle}
            >
              Design proposal
            </a>
            <a
              href="https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/claude-code.md"
              style={linkStyle}
            >
              Claude Code guide
            </a>
            <a
              href="https://github.com/ffMathy/agentic-intermediate-language/tree/main/site"
              style={linkStyle}
            >
              This site's spec
            </a>
          </Stack>
        </nav>
      </Stack>
    </footer>
  );
}
