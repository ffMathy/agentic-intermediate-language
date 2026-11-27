import type { CSSProperties } from "react";
import { specProjects } from "../../../../../spec";
import type { Inset } from "../../walkthrough/walkthrough";

export type WalkInsetProps = {
  inset: Inset;
};

const cardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-2)",
  minWidth: 0,
  padding: "var(--space-3)",
  background: "var(--color-code)",
  border: "1px solid var(--color-code-border)",
  borderRadius: "var(--radius-md)",
};

const labelStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-tiny)",
  color: "var(--color-code-muted)",
  overflowWrap: "anywhere",
  lineHeight: 1.4,
};

const linesStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 0,
};

const lineStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-tiny)",
  lineHeight: 1.5,
  color: "var(--color-code-text)",
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
};

const shotStyle: CSSProperties = {
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-2)",
  minWidth: 0,
};

const captionStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--space-2)",
};

const captionLabelStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "var(--font-tiny)",
  fontWeight: 700,
  color: "var(--color-code-muted)",
};

const pillStyle: CSSProperties = {
  padding: "2px var(--space-2)",
  borderRadius: "var(--radius-pill)",
  background: "var(--color-pass)",
  color: "var(--color-on-accent)",
  fontSize: "var(--font-micro)",
  fontWeight: 700,
  letterSpacing: "0.08em",
};

const imageStyle: CSSProperties = {
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
};

/** Each chapter has one detail worth a closer look: a card of what the tool reads or writes, or a screenshot of the app it checks. */
export function WalkInset({ inset }: WalkInsetProps) {
  if (inset.kind === "card") {
    return (
      <div style={cardStyle}>
        <p style={labelStyle}>{inset.label}</p>
        <div style={linesStyle}>
          {inset.lines.map((line, index) => (
            <p key={index} style={lineStyle}>
              {line}
            </p>
          ))}
        </div>
      </div>
    );
  }
  if (inset.kind === "shot") {
    const project = specProjects.find((p) => p.key === "tictactoe");
    if (project === undefined) {
      return null;
    }
    const matches = project.shots.filter(
      (s) => s.node === inset.node && s.test === inset.test,
    );
    if (matches.length === 0) {
      return null;
    }
    const shot = matches[matches.length - 1];
    return (
      <figure style={shotStyle}>
        <figcaption style={captionStyle}>
          <span style={captionLabelStyle}>{inset.label}</span>
          {inset.verdict !== undefined ? (
            <span style={pillStyle}>{inset.verdict}</span>
          ) : null}
        </figcaption>
        <img
          src={shot.src}
          alt={`Screenshot of the app at the end of the check “${inset.test}”`}
          style={imageStyle}
        />
      </figure>
    );
  }
  return null;
}
