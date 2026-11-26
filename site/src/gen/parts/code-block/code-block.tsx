import type { CSSProperties, ReactNode } from "react";
import { Stack } from "../stack/stack";

export type CodeBlockProps = {
  lines: string[];
  label: string;
  edge?: string;
  highlight?: string[];
  caption?: string;
};

type Range = { start: number; end: number };

const markStyle: CSSProperties = {
  background: "var(--color-thread-soft)",
  color: "var(--color-thread)",
  borderBottom: "1px solid var(--color-thread)",
  padding: "0 2px",
  borderRadius: "2px",
};

const headStyle: CSSProperties = {
  wordBreak: "break-all",
};

const captionStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-tiny)",
  color: "var(--color-text-muted)",
  overflowWrap: "anywhere",
};

function tokenVar(token: string): string {
  return `var(--${token.split(".").join("-")})`;
}

function lineStyle(n: number): CSSProperties {
  return {
    display: "block",
    paddingLeft: `${n + 4}ch`,
    textIndent: `-${n + 4}ch`,
  };
}

function findRanges(line: string, phrases: string[]): Range[] {
  const ranges: Range[] = [];
  let i = 0;
  while (i < line.length) {
    let best = 0;
    for (const phrase of phrases) {
      if (phrase.length > best && line.startsWith(phrase, i)) {
        best = phrase.length;
      }
    }
    if (best > 0) {
      ranges.push({ start: i, end: i + best });
      i += best;
    } else {
      i += 1;
    }
  }
  return ranges;
}

function renderPieces(
  line: string,
  start: number,
  end: number,
  ranges: Range[],
): ReactNode[] {
  const nodes: ReactNode[] = [];
  let pos = start;
  for (const r of ranges) {
    if (r.start < start || r.end > end) {
      continue;
    }
    if (r.start > pos) {
      nodes.push(line.slice(pos, r.start));
    }
    nodes.push(
      <mark key={r.start} style={markStyle}>
        {line.slice(r.start, r.end)}
      </mark>,
    );
    pos = r.end;
  }
  if (pos < end) {
    nodes.push(line.slice(pos, end));
  }
  return nodes;
}

function renderLine(line: string, index: number, phrases: string[]): ReactNode {
  if (line === "") {
    return (
      <span key={index} style={lineStyle(0)}>
        {" "}
      </span>
    );
  }
  let n = 0;
  while (n < line.length && line[n] === " ") {
    n += 1;
  }
  const spaceAfter = line.indexOf(" ", n);
  let headEnd = spaceAfter === -1 ? line.length : spaceAfter;
  const ranges = findRanges(line, phrases);
  for (const r of ranges) {
    if (r.start < headEnd && r.end > headEnd) {
      headEnd = r.end;
    }
  }
  return (
    <span key={index} style={lineStyle(n)}>
      <span style={headStyle}>{renderPieces(line, 0, headEnd, ranges)}</span>
      {renderPieces(line, headEnd, line.length, ranges)}
    </span>
  );
}

/** shows the given lines exactly, one per line, keeping every space; an empty line stays an empty line */
export function CodeBlock({ lines, label, edge, highlight, caption }: CodeBlockProps) {
  const phrases = (highlight ?? []).filter((p) => p.length > 0);
  const preStyle: CSSProperties = {
    background: "var(--color-code)",
    color: "var(--color-code-text)",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--font-code)",
    lineHeight: 1.6,
    padding: "clamp(12px, 3vw, 16px)",
    borderRadius: "var(--radius-md)",
    margin: 0,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    ...(edge !== undefined ? { borderLeft: `4px solid ${tokenVar(edge)}` } : {}),
  };
  return (
    <Stack dir="v" gap="space.2" align="stretch">
      <pre role="region" aria-label={label} style={preStyle}>
        {lines.map((line, i) => renderLine(line, i, phrases))}
      </pre>
      {caption !== undefined ? <div style={captionStyle}>{caption}</div> : null}
    </Stack>
  );
}
