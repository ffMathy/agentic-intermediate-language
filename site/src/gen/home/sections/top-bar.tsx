import { Stack } from "../../parts/stack";

const linkStyle = {
  fontSize: "var(--font-small)",
  fontWeight: 600,
  color: "var(--color-text)",
  textDecoration: "none",
  padding: "var(--space-1) 0",
};

const links = [
  { href: "#journey", text: "The journey" },
  { href: "#readers", text: "Four readers" },
  { href: "#loop", text: "How it builds" },
  { href: "#start", text: "Get started" },
  { href: "https://github.com/ffMathy/agentic-intermediate-language", text: "GitHub ↗" },
];

/** the name of the project on the left, and five links on the right */
export function TopBar() {
  return (
    <header
      style={{
        width: "100%",
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
        style={{ maxWidth: "var(--width-content)", margin: "0 auto" }}
      >
        <Stack dir="h" gap="space.2" align="center" wrap={true}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "20px",
              fontWeight: 800,
              color: "var(--color-accent)",
              letterSpacing: "-0.01em",
            }}
          >
            AIL
          </span>
          <span style={{ fontSize: "var(--font-small)", color: "var(--color-text-muted)" }}>
            Agentic Intermediate Language
          </span>
        </Stack>
        <nav aria-label="Sections">
          <Stack dir="h" gap="space.4" align="center" wrap={true}>
            {links.map((link) => (
              <a key={link.href} href={link.href} style={linkStyle}>
                {link.text}
              </a>
            ))}
          </Stack>
        </nav>
      </Stack>
    </header>
  );
}
