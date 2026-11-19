import type { CSSProperties, ReactNode } from "react";
import { Stack } from "./stack";

type CodeBlockProps = {
  lines: string[];
  label: string;
  edge?: string;
  highlight?: string[];
  caption?: string;
};

const blockStyle: CSSProperties = {
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

function tokenVar(name: string): string {
  return `var(--${name.replace(/\./g, "-")})`;
}

function markLine(line: string, phrases: string[]): ReactNode[] {
  const parts: ReactNode[] = [];
  let plain = "";
  let i = 0;
  while (i < line.length) {
    const found = phrases.find((p) => line.startsWith(p, i));
    if (found !== undefined) {
      if (plain !== "") {
        parts.push(plain);
        plain = "";
      }
      parts.push(
        <mark key={i} style={markStyle}>
          {found}
        </mark>,
      );
      i += found.length;
    } else {
      plain += line[i];
      i += 1;
    }
  }
  if (plain !== "") {
    parts.push(plain);
  }
  return parts;
}

/** "shows the given lines exactly, one per line, keeping every space; an empty line stays an empty line" */
export function CodeBlock({ lines, label, edge, highlight, caption }: CodeBlockProps) {
  const phrases = (highlight ?? []).filter((p) => p !== "");
  const preStyle: CSSProperties =
    edge === undefined
      ? blockStyle
      : { ...blockStyle, borderLeft: `4px solid ${tokenVar(edge)}` };
  return (
    <Stack dir="v" gap="space.2" align="stretch">
      <pre role="region" aria-label={label} style={preStyle}>
        {lines.map((line, index) => {
          const n = line.length - line.trimStart().length;
          const lineStyle: CSSProperties = {
            display: "block",
            paddingLeft: `${n + 4}ch`,
            textIndent: `-${n + 4}ch`,
          };
          return (
            <span key={index} style={lineStyle}>
              {line === "" ? " " : markLine(line, phrases)}
            </span>
          );
        })}
      </pre>
      {caption !== undefined && <div style={captionStyle}>{caption}</div>}
    </Stack>
  );
}
