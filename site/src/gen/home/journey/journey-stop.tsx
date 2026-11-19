import type { ReactNode } from "react";
import { Stack } from "../../parts/stack";
import { CodeBlock } from "../../parts/code-block";

type JourneyStopProps = {
  number: number;
  color: string;
  depth: string;
  chip: string;
  reader: string;
  headline: string;
  explanation: string;
  lines: string[];
  label: string;
  file: string;
  highlight: string[];
  turnsInto: string;
  figure: ReactNode;
  last?: boolean;
};

function tokenVar(name: string): string {
  return `var(--${name.split(".").join("-")})`;
}

/** "a numbered marker on a vertical rail in the stop's color, with a short depth label under the marker" */
export function JourneyStop({
  number,
  color,
  depth,
  chip,
  reader,
  headline,
  explanation,
  lines,
  label,
  file,
  highlight,
  turnsInto,
  figure,
  last,
}: JourneyStopProps) {
  const stopColor = tokenVar(color);
  return (
    <article
      id={`stop-${number}`}
      style={{
        display: "grid",
        gridTemplateColumns: "56px minmax(0, 1fr)",
        columnGap: "var(--space-4)",
        padding: "0 0 var(--space-12) 0",
        scrollMarginTop: "var(--space-4)",
      }}
    >
      <div style={{ gridColumn: 1, position: "relative" }}>
        <div
          aria-hidden="true"
          style={
            last
              ? {
                  position: "absolute",
                  left: "26px",
                  top: 0,
                  width: "4px",
                  background: stopColor,
                  height: "36px",
                }
              : {
                  position: "absolute",
                  left: "26px",
                  top: 0,
                  width: "4px",
                  background: stopColor,
                  bottom: 0,
                }
          }
        />
        <div
          aria-hidden="true"
          style={{
            position: "relative",
            marginLeft: "10px",
            width: "36px",
            height: "36px",
            boxSizing: "border-box",
            borderRadius: "var(--radius-pill)",
            background: stopColor,
            border: "3px solid var(--color-surface)",
            boxShadow: `0 0 0 1px ${stopColor}`,
            color: "var(--color-on-accent)",
            fontSize: "var(--font-small)",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {number}
        </div>
        <div
          style={{
            position: "relative",
            marginTop: "var(--space-2)",
            width: "56px",
            textAlign: "center",
            fontSize: "var(--font-micro)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--color-text-muted)",
            background: "var(--color-page)",
            padding: "var(--space-1) 0",
          }}
        >
          {depth}
        </div>
      </div>
      <Stack dir="v" gap="space.4" align="stretch" style={{ gridColumn: 2 }}>
        <Stack dir="h" gap="space.3" align="center" wrap={true}>
          <span
            style={{
              background: stopColor,
              color: "var(--color-on-accent)",
              fontSize: "var(--font-micro)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              borderRadius: "var(--radius-pill)",
              padding: "var(--space-1) var(--space-3)",
            }}
          >
            {chip}
          </span>
          <span
            style={{
              fontSize: "var(--font-small)",
              color: "var(--color-text-muted)",
            }}
          >
            {`Who reads this: ${reader}`}
          </span>
        </Stack>
        <h3
          style={{
            fontSize: "var(--font-stop)",
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          {headline}
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
            gap: "var(--space-6)",
            alignItems: "start",
          }}
        >
          <Stack dir="v" gap="space.4" align="stretch" style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: "var(--font-body)",
                lineHeight: 1.6,
                color: "var(--color-text-muted)",
                maxWidth: "var(--width-prose)",
                margin: 0,
              }}
            >
              {explanation}
            </p>
            <CodeBlock
              lines={lines}
              label={label}
              caption={file}
              highlight={highlight}
              edge={color}
            />
            <p
              style={{
                background: "var(--color-accent-soft)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-2) var(--space-4)",
                fontSize: "var(--font-small)",
                lineHeight: 1.5,
                color: "var(--color-text)",
                margin: 0,
              }}
            >
              <span style={{ fontWeight: 700, color: "var(--color-accent)" }}>
                Turns into:
              </span>
              {" "}
              {turnsInto}
            </p>
          </Stack>
          <div
            style={{
              background: "var(--color-surface-raised)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-4)",
              minHeight: "200px",
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {figure}
          </div>
        </div>
      </Stack>
    </article>
  );
}
