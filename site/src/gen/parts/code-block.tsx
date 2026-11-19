import type { CSSProperties, ReactNode } from "react";
import { Stack } from "./stack";

type Segment = {
  text: string;
  marked: boolean;
};

const tokenVar = (token: string): string => `var(--${token.split(".").join("-")})`;

const preStyle: CSSProperties = {
  background: "var(--color-code)",
  color: "var(--color-code-text)",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-code)",
  lineHeight: 1.6,
  padding: "var(--space-4)",
  borderRadius: "var(--radius-md)",
  margin: 0,
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
};

const markStyle: CSSProperties = {
  background: "var(--color-thread-soft)",
  color: "var(--color-thread)",
  borderBottom: "1px solid var(--color-thread)",
  padding: "0 2px",
  borderRadius: "2px",
};

const captionStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-tiny)",
  color: "var(--color-text-muted)",
  overflowWrap: "anywhere",
};

const splitLine = (line: string, phrases: string[]): Segment[] => {
  const segments: Segment[] = [];
  let pos = 0;
  let plainStart = 0;
  while (pos < line.length) {
    let bestIndex = -1;
    let bestLength = 0;
    for (const phrase of phrases) {
      if (phrase.length === 0) {
        continue;
      }
      const index = line.indexOf(phrase, pos);
      if (index === -1) {
        continue;
      }
      if (bestIndex === -1 || index < bestIndex || (index === bestIndex && phrase.length > bestLength)) {
        bestIndex = index;
        bestLength = phrase.length;
      }
    }
    if (bestIndex === -1) {
      break;
    }
    if (bestIndex > plainStart) {
      segments.push({ text: line.slice(plainStart, bestIndex), marked: false });
    }
    segments.push({ text: line.slice(bestIndex, bestIndex + bestLength), marked: true });
    pos = bestIndex + bestLength;
    plainStart = pos;
  }
  if (plainStart < line.length) {
    segments.push({ text: line.slice(plainStart), marked: false });
  }
  return segments;
};

const renderLine = (line: string, phrases: string[], index: number): ReactNode => {
  const leading = line.length - line.trimStart().length;
  const offset = `${leading + 4}ch`;
  const style: CSSProperties = {
    display: "block",
    paddingLeft: offset,
    textIndent: `-${offset}`,
  };
  if (line.length === 0) {
    return (
      <span key={index} style={style}>
        {" "}
      </span>
    );
  }
  return (
    <span key={index} style={style}>
      {splitLine(line, phrases).map((segment, i) =>
        segment.marked ? (
          <mark key={i} style={markStyle}>
            {segment.text}
          </mark>
        ) : (
          segment.text
        ),
      )}
    </span>
  );
};

/** Shows the given lines exactly, one per line, keeping every space; every occurrence of each highlight phrase is marked, in every line. */
export function CodeBlock({
  lines,
  label,
  edge,
  highlight,
  caption,
}: {
  lines: string[];
  label: string;
  edge?: string;
  highlight?: string[];
  caption?: string;
}) {
  const phrases = highlight ?? [];
  const blockStyle: CSSProperties =
    edge === undefined ? preStyle : { ...preStyle, borderLeft: `4px solid ${tokenVar(edge)}` };
  return (
    <Stack dir="v" gap="space.2" align="stretch">
      <pre role="region" aria-label={label} style={blockStyle}>
        {lines.map((line, index) => renderLine(line, phrases, index))}
      </pre>
      {caption !== undefined ? <div style={captionStyle}>{caption}</div> : null}
    </Stack>
  );
}
