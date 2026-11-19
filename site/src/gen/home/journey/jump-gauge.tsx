import { Fragment } from "react";
import { Stack } from "../../parts/stack";

const stops: { label: string; color: string }[] = [
  { label: "1 Idea", color: "var(--color-accent)" },
  { label: "2 Product", color: "var(--color-level-product)" },
  { label: "3 Experience", color: "var(--color-level-experience)" },
  { label: "4 System", color: "var(--color-level-system)" },
  { label: "5 Specialist", color: "var(--color-level-specialist)" },
  { label: "6 Build", color: "var(--color-level-build)" },
  { label: "7 Proof", color: "var(--color-level-build)" },
  { label: "8 Play", color: "var(--color-accent)" },
];

/** eight pills in a row, one per stop, each in its stop's color, joined by short lines; the row wraps when it runs out of room */
export function JumpGauge() {
  return (
    <nav aria-label="Journey stops">
      <Stack dir="h" gap="space.2" align="center" wrap={true}>
        {stops.map((stop, i) => (
          <Fragment key={stop.label}>
            {i > 0 && (
              <span
                aria-hidden="true"
                style={{
                  width: "12px",
                  height: "2px",
                  background: "var(--color-border)",
                }}
              />
            )}
            <a
              href={`#stop-${i + 1}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "32px",
                padding: "0 var(--space-3)",
                borderRadius: "var(--radius-pill)",
                background: "var(--color-surface)",
                border: `1px solid ${stop.color}`,
                color: stop.color,
                fontSize: "var(--font-small)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {stop.label}
            </a>
          </Fragment>
        ))}
      </Stack>
    </nav>
  );
}
