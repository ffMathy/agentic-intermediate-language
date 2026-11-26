import { Stack } from "../../../parts/stack/stack";

const paragraphStyle = {
  lineHeight: 1.6,
  maxWidth: "var(--width-prose)",
  margin: 0,
};

const inlineStyle = {
  color: "var(--color-code-text)",
  fontWeight: 600,
  textDecoration: "underline",
};

const linkStyle = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "44px",
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

/** a strip of the four level colors, one sentence on where this page and the game came from, one sentence naming the other projects written in AIL, each name a link to its repository, and seven links */
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
      <div
        style={{
          maxWidth: "var(--width-content)",
          margin: "0 auto",
          boxSizing: "content-box",
          padding: "clamp(24px, 6vw, 32px) var(--space-4)",
        }}
      >
        <Stack dir="v" gap="space.4" align="start">
          <p style={paragraphStyle}>
            Brewed in AIL. This page was compiled from the spec in site/ail/, and the game from the spec in examples/tictactoe/ail/. Apart from the spec and a short index.html, nothing in either was written by hand.
          </p>
          <p style={paragraphStyle}>
            {"Also written in AIL: "}
            <a href="https://github.com/ffMathy/Shapeshifter" style={inlineStyle}>
              Shapeshifter
            </a>
            {", a clipboard manager for Windows, macOS and Linux, and "}
            <a href="https://github.com/ffMathy/valafind" style={inlineStyle}>
              Valafind
            </a>
            {", semantic search for the files on your computer."}
          </p>
          <nav
            aria-label="More about AIL"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              columnGap: "var(--space-4)",
              rowGap: 0,
            }}
          >
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
              href="https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md"
              style={linkStyle}
            >
              Language definition
            </a>
            <a
              href="https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/claude-code.md"
              style={linkStyle}
            >
              Claude Code guide
            </a>
            <a
              href="https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/cursor.md"
              style={linkStyle}
            >
              Cursor guide
            </a>
            <a
              href="https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/copilot.md"
              style={linkStyle}
            >
              Copilot guide
            </a>
            <a
              href="https://github.com/ffMathy/agentic-intermediate-language/tree/main/site"
              style={linkStyle}
            >
              This site&apos;s spec
            </a>
          </nav>
        </Stack>
      </div>
    </footer>
  );
}
