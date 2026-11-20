import type { CSSProperties } from "react";
import { Stack } from "../../parts/stack";

const stops: { n: number; label: string; color: string }[] = [
  { n: 1, label: "1 Idea", color: "var(--color-accent)" },
  { n: 2, label: "2 Product", color: "var(--color-level-product)" },
  { n: 3, label: "3 Experience", color: "var(--color-level-experience)" },
  { n: 4, label: "4 System", color: "var(--color-level-system)" },
  { n: 5, label: "5 Specialist", color: "var(--color-level-specialist)" },
  { n: 6, label: "6 Build", color: "var(--color-level-build)" },
  { n: 7, label: "7 Proof", color: "var(--color-level-build)" },
  { n: 8, label: "8 Play", color: "var(--color-accent)" },
];

const groupLabelStyle: CSSProperties = {
  fontSize: "var(--font-micro)",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--color-text-muted)",
};

function Pill({ n, label, color }: { n: number; label: string; color: string }) {
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "44px",
    padding: "0 var(--space-3)",
    borderRadius: "var(--radius-pill)",
    background: "var(--color-surface)",
    border: `1px solid ${color}`,
    color,
    fontSize: "var(--font-small)",
    fontWeight: 600,
    textDecoration: "none",
  };
  return (
    <a href={`#stop-${n}`} style={style}>
      {label}
    </a>
  );
}

function Group({ label, from, to }: { label: string; from: number; to: number }) {
  return (
    <Stack dir="v" gap="space.1" align="start">
      <span style={groupLabelStyle}>{label}</span>
      <Stack dir="h" gap="space.2" align="center" wrap={true}>
        {stops
          .filter((stop) => stop.n >= from && stop.n <= to)
          .map((stop) => (
            <Pill key={stop.n} n={stop.n} label={stop.label} color={stop.color} />
          ))}
      </Stack>
    </Stack>
  );
}

/** eight pills, one per stop, each in its stop's color, with no lines between them, in three groups */
export function JumpGauge() {
  const first = stops[0];
  return (
    <nav aria-label="Journey stops">
      <Stack dir="h" gap="space.4" align="end" wrap={true}>
        <Pill n={first.n} label={first.label} color={first.color} />
        <Group label="The spec: four levels" from={2} to={5} />
        <Group label="What it becomes" from={6} to={8} />
      </Stack>
    </nav>
  );
}
