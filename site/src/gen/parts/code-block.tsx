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

const markStyle: CSSProperties = {
  background: "var(--color-thread-soft)",
  color: "var(--color-thread)",
  borderBottom: "1px solid var(--color-thread)",
  padding: "0 2px",
  borderRadius: "2px",
};

const markLine = (line: string, phrases: string[]): ReactNode[] => {
  const parts: ReactNode[] = [];
  let rest = 0;
  let plain = "";
  while (rest < line.length) {
    let bestAt = -1;
    let bestPhrase = "";
    for (const phrase of phrases) {
      const at = line.indexOf(phrase, rest);
      if (at === -1) {
        continue;
      }
      if (bestAt === -1 || at < bestAt || (at === bestAt && phrase.length > bestPhrase.length)) {
        bestAt = at;
        bestPhrase = phrase;
      }
    }
    if (bestAt === -1) {
      plain += line.slice(rest);
      break;
    }
    plain += line.slice(rest, bestAt);
    if (plain !== "") {
      parts.push(plain);
      plain = "";
    }
    parts.push(
      <mark key={parts.length} style={markStyle}>
        {bestPhrase}
      </mark>,
    );
    rest = bestAt + bestPhrase.length;
  }
  if (plain !== "") {
    parts.push(plain);
  }
  return parts;
};

/** "shows the given lines exactly, one per line, keeping every space; an empty line stays an empty line" */
export function CodeBlock({ lines, label, edge, highlight, caption }: CodeBlockProps) {
  const phrases = (highlight ?? []).filter((phrase) => phrase !== "");
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
    ...(edge !== undefined ? { borderLeft: `4px solid ${tokenVar(edge)}` } : {}),
  };
  return (
    <Stack dir="v" gap="space.2" align="stretch">
      <pre role="region" aria-label={label} style={preStyle}>
        {lines.map((line, index) => {
          const n = line.length - line.replace(/^ +/, "").length;
          const indent = n + 4;
          return (
            <span
              key={index}
              style={{
                display: "block",
                paddingLeft: `${indent}ch`,
                textIndent: `-${indent}ch`,
              }}
            >
              {line === "" ? " " : markLine(line, phrases)}
            </span>
          );
        })}
      </pre>
      {caption !== undefined ? (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-tiny)",
            color: "var(--color-text-muted)",
            overflowWrap: "anywhere",
          }}
        >
          {caption}
        </div>
      ) : null}
    </Stack>
  );
}
