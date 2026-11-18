/** CodeBlock: shows the given lines exactly, one per line, keeping every space. */
export function CodeBlock(props: { lines: string[]; label: string }) {
  return (
    <pre
      role="region"
      aria-label={props.label}
      style={{
        background: "var(--color-code)",
        color: "var(--color-code-text)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-4)",
        fontFamily: "monospace",
        fontSize: "var(--font-code)",
        margin: 0,
        whiteSpace: "pre",
        overflowX: "auto",
      }}
    >
      {props.lines.join("\n")}
    </pre>
  );
}
