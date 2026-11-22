import type { ReactElement } from "react";
import { specProjects } from "../../spec";
import type { Inset } from "./walkthrough/walkthrough";

/** a card shows its label and then its lines in a small code font, each on its own line, keeping their spaces; a screenshot shows its label, the verdict when there is one, and the committed screenshot of that node at the end of that check */
export function WalkInset({ inset }: { inset: Inset }): ReactElement | null {
  if (inset.kind === "card") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          minWidth: 0,
          padding: "var(--space-3)",
          background: "var(--color-code)",
          border: "1px solid var(--color-code-border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-tiny)",
            color: "var(--color-code-muted)",
            overflowWrap: "anywhere",
          }}
        >
          {inset.label}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
          }}
        >
          {inset.lines.map((line, index) => (
            <p
              key={index}
              style={{
                margin: 0,
                fontFamily: "var(--font-mono)",
                fontSize: "var(--font-tiny)",
                lineHeight: 1.5,
                color: "var(--color-code-text)",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    );
  }
  if (inset.kind === "shot") {
    const project = specProjects.find((p) => p.key === "tictactoe");
    const matches = project
      ? project.shots.filter((s) => s.node === inset.node && s.test === inset.test)
      : [];
    const shot = matches.length > 0 ? matches[matches.length - 1] : undefined;
    if (!shot) {
      return null;
    }
    return (
      <figure
        style={{
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          minWidth: 0,
        }}
      >
        <figcaption
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--font-tiny)",
              fontWeight: 700,
              color: "var(--color-code-muted)",
            }}
          >
            {inset.label}
          </span>
          {inset.verdict !== undefined ? (
            <span
              style={{
                padding: "2px var(--space-2)",
                borderRadius: "var(--radius-pill)",
                background: "var(--color-pass)",
                color: "var(--color-on-accent)",
                fontSize: "var(--font-micro)",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              {inset.verdict}
            </span>
          ) : null}
        </figcaption>
        <img
          src={shot.src}
          alt={`Screenshot of the app at the end of the check “${inset.test}”`}
          style={{
            display: "block",
            width: "auto",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "240px",
            alignSelf: "flex-start",
            objectFit: "contain",
            boxSizing: "border-box",
            background: "var(--color-surface)",
            border: "1px solid var(--color-code-border)",
            borderRadius: "var(--radius-md)",
          }}
        />
      </figure>
    );
  }
  return null;
}
