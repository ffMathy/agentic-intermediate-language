/** shows the screenshot as large as fits, without cropping or stretching, with the node's name and the check it ends under it */
export function SpecShot({
  node,
  test,
  path,
  src,
}: {
  node: string;
  test: string;
  path: string;
  src: string;
}) {
  return (
    <figure
      role="region"
      aria-label={`Screenshot ${path}`}
      style={{
        margin: 0,
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-4)",
        background: "var(--color-code)",
      }}
    >
      <img
        src={src}
        alt={`Screenshot at the end of the check “${test}”`}
        style={{
          display: "block",
          maxWidth: "100%",
          minHeight: 0,
          flex: "1 1 auto",
          objectFit: "contain",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-code-border)",
          background: "var(--color-surface)",
        }}
      />
      <figcaption
        style={{
          fontSize: "var(--font-tiny)",
          color: "var(--color-code-muted)",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-code-text)",
          }}
        >
          {node}
        </span>
        {` · the screen at the end of the check “${test}”`}
      </figcaption>
    </figure>
  );
}
