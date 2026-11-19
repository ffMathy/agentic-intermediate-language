import type { CSSProperties } from "react";
import { Stack } from "../../parts/stack";

const stops: { n: number; text: string; color: string }[] = [
  { n: 1, text: "1 Idea", color: "var(--color-accent)" },
  { n: 2, text: "2 Product", color: "var(--color-level-product)" },
  { n: 3, text: "3 Experience", color: "var(--color-level-experience)" },
  { n: 4, text: "4 System", color: "var(--color-level-system)" },
  { n: 5, text: "5 Specialist", color: "var(--color-level-specialist)" },
  { n: 6, text: "6 Build", color: "var(--color-level-build)" },
  { n: 7, text: "7 Proof", color: "var(--color-level-build)" },
  { n: 8, text: "8 Play", color: "var(--color-accent)" },
];

const groupLabelStyle: CSSProperties = {
  fontSize: "var(--font-micro)",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--color-text-muted)",
};

function Pill({ n }: { n: number }) {
  const stop = stops[n - 1];
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "44px",
    padding: "0 var(--space-3)",
    borderRadius: "var(--radius-pill)",
    background: "var(--color-surface)",
    border: `1px solid ${stop.color}`,
    color: stop.color,
    fontSize: "var(--font-small)",
    fontWeight: 600,
    textDecoration: "none",
  };
  return (
    <a href={`#stop-${stop.n}`} style={style}>
      {stop.text}
    </a>
  );
}

function Group({ label, pills }: { label: string; pills: number[] }) {
  return (
    <Stack dir="v" gap="space.1" align="start">
      <span style={groupLabelStyle}>{label}</span>
      <Stack dir="h" gap="space.2" align="center" wrap={true}>
        {pills.map((n) => (
          <Pill key={n} n={n} />
        ))}
      </Stack>
    </Stack>
  );
}

/** eight pills, one per stop, each in its stop's color, with no lines between them, in three groups */
export function JumpGauge() {
  return (
    <nav aria-label="Journey stops">
      <Stack dir="h" gap="space.4" align="end" wrap={true}>
        <Pill n={1} />
        <Group label="The spec: four levels" pills={[2, 3, 4, 5]} />
        <Group label="What it becomes" pills={[6, 7, 8]} />
      </Stack>
    </nav>
  );
}
