import { Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Stack } from "./stack";

interface CodeBlockProps {
  lines: string[];
  label: string;
  edge?: string;
  highlight?: string[];
  caption?: string;
}

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

function tokenVar(token: string): string {
  return "var(--" + token.split(".").join("-") + ")";
}

function renderLine(line: string, phrases: string[]): ReactNode[] {
  const parts: ReactNode[] = [];
  let rest = 0;
  let plainStart = 0;
  while (rest < line.length) {
    let foundAt = -1;
    let foundPhrase = "";
    for (const phrase of phrases) {
      const at = line.indexOf(phrase, rest);
      if (at !== -1 && (foundAt === -1 || at < foundAt)) {
        foundAt = at;
        foundPhrase = phrase;
      }
    }
    if (foundAt === -1) {
      break;
    }
    if (foundAt > plainStart) {
      parts.push(line.slice(plainStart, foundAt));
    }
    parts.push(
      <mark key={foundAt} style={markStyle}>
        {foundPhrase}
      </mark>,
    );
    rest = foundAt + foundPhrase.length;
    plainStart = rest;
  }
  if (plainStart < line.length) {
    parts.push(line.slice(plainStart));
  }
  return parts;
}

/** Spec excerpts and code must be shown exactly, with the followed promise easy to spot. */
export function CodeBlock({ lines, label, edge, highlight, caption }: CodeBlockProps) {
  const phrases = (highlight ?? []).filter((phrase) => phrase.length > 0);
  const blockStyle: CSSProperties = {
    background: "var(--color-code)",
    color: "var(--color-code-text)",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--font-code)",
    lineHeight: 1.6,
    padding: "var(--space-4)",
    borderRadius: "var(--radius-md)",
    margin: 0,
    overflowX: "auto",
    whiteSpace: "pre",
    ...(edge !== undefined ? { borderLeft: "4px solid " + tokenVar(edge) } : {}),
  };
  return (
    <Stack dir="v" gap="space.2" align="stretch">
      <pre role="region" aria-label={label} style={blockStyle}>
        {lines.map((line, index) => (
          <Fragment key={index}>
            {index > 0 ? "\n" : null}
            {renderLine(line, phrases)}
          </Fragment>
        ))}
      </pre>
      {caption !== undefined ? <div style={captionStyle}>{caption}</div> : null}
    </Stack>
  );
}
