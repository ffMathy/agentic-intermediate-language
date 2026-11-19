import { Stack } from "../../parts/stack";

const linkStyle = {
  fontSize: "var(--font-small)",
  fontWeight: 600,
  color: "var(--color-text)",
  textDecoration: "none",
  padding: "var(--space-1) 0",
};

/** the name of the project on the left, and seven links on the right */
export function TopBar() {
  return (
    <header
      style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        boxSizing: "border-box",
        padding: "var(--space-3) var(--space-4)",
      }}
    >
      <Stack
        dir="h"
        gap="space.4"
        align="center"
        justify="between"
        wrap={true}
        style={{
          maxWidth: "var(--width-content)",
          margin: "0 auto",
        }}
      >
        <Stack dir="h" gap="space.2" align="center" wrap={true}>
          <svg
            aria-hidden="true"
            viewBox="0 0 22 28"
            width="22px"
            height="28px"
            style={{ display: "block" }}
          >
            <path
              d="M3 4 H19 L17.5 26 H4.5 Z"
              fill="var(--color-level-experience)"
              stroke="var(--color-text)"
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <path
              d="M3 4 H19 L18.6 10 H3.4 Z"
              fill="var(--color-page)"
              stroke="var(--color-text)"
              strokeWidth={2}
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              fontWeight: 800,
              color: "var(--color-text)",
              letterSpacing: "-0.01em",
            }}
          >
            AIL
          </span>
          <span
            style={{
              fontSize: "var(--font-small)",
              color: "var(--color-text-muted)",
            }}
          >
            Agentic Intermediate Language
          </span>
        </Stack>
        <nav aria-label="Sections">
          <Stack dir="h" gap="space.4" align="center" wrap={true}>
            <a href="#journey" style={linkStyle}>
              The journey
            </a>
            <a href="#readers" style={linkStyle}>
              Four readers
            </a>
            <a href="#loop" style={linkStyle}>
              How it builds
            </a>
            <a href="#adopt" style={linkStyle}>
              Adopt an app
            </a>
            <a href="#specs" style={linkStyle}>
              Browse the specs
            </a>
            <a href="#start" style={linkStyle}>
              Get started
            </a>
            <a
              href="https://github.com/ffMathy/agentic-intermediate-language"
              style={linkStyle}
            >
              GitHub ↗
            </a>
          </Stack>
        </nav>
      </Stack>
    </header>
  );
}
