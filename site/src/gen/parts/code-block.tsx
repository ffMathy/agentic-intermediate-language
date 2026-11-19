import type { CSSProperties, ReactNode } from "react";
import { Stack } from "./stack";

export type CodeBlockProps = {
  lines: string[];
  label: string;
  edge?: string;
  highlight?: string[];
  caption?: string;
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

const markLine = (line: string, phrases: string[]): ReactNode[] => {
  const parts: ReactNode[] = [];
  let pos = 0;
  let plain = "";
  while (pos < line.length) {
    let bestAt = -1;
    let bestPhrase = "";
    for (const phrase of phrases) {
      if (phrase.length === 0) {
        continue;
      }
      const at = line.indexOf(phrase, pos);
      if (at !== -1 && (bestAt === -1 || at < bestAt)) {
        bestAt = at;
        bestPhrase = phrase;
      }
    }
    if (bestAt === -1) {
      break;
    }
    plain += line.slice(pos, bestAt);
    if (plain.length > 0) {
      parts.push(plain);
      plain = "";
    }
    parts.push(
      <mark key={parts.length} style={markStyle}>
        {bestPhrase}
      </mark>,
    );
    pos = bestAt + bestPhrase.length;
  }
  plain += line.slice(pos);
  if (plain.length > 0) {
    parts.push(plain);
  }
  return parts;
};

/** "shows the given lines exactly, one per line, keeping every space; an empty line stays an empty line" */
export function CodeBlock({ lines, label, edge, highlight, caption }: CodeBlockProps) {
  const phrases = highlight ?? [];
  const style: CSSProperties =
    edge !== undefined ? { ...preStyle, borderLeft: `4px solid ${tokenVar(edge)}` } : preStyle;
  return (
    <Stack dir="v" gap="space.2" align="stretch">
      <pre role="region" aria-label={label} style={style}>
        {lines.map((line, i) => {
          const n = line.length - line.trimStart().length;
          const indent = n + 4;
          return (
            <span
              key={i}
              style={{
                display: "block",
                paddingLeft: `${indent}ch`,
                textIndent: `-${indent}ch`,
              }}
            >
              {line.length === 0 ? " " : markLine(line, phrases)}
            </span>
          );
        })}
      </pre>
      {caption !== undefined ? <div style={captionStyle}>{caption}</div> : null}
    </Stack>
  );
}
