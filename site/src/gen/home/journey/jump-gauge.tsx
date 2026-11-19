import { Stack } from "../../parts/stack";

type Stop = {
  n: number;
  label: string;
  color: string;
};

const stops: Stop[] = [
  { n: 1, label: "1 Idea", color: "var(--color-accent)" },
  { n: 2, label: "2 Product", color: "var(--color-level-product)" },
  { n: 3, label: "3 Experience", color: "var(--color-level-experience)" },
  { n: 4, label: "4 System", color: "var(--color-level-system)" },
  { n: 5, label: "5 Specialist", color: "var(--color-level-specialist)" },
  { n: 6, label: "6 Build", color: "var(--color-level-build)" },
  { n: 7, label: "7 Proof", color: "var(--color-level-build)" },
  { n: 8, label: "8 Play", color: "var(--color-accent)" },
];

function Pill({ stop }: { stop: Stop }) {
  return (
    <a
      href={`#stop-${stop.n}`}
      style={{
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
      }}
    >
      {stop.label}
    </a>
  );
}

function Group({ label, items }: { label: string; items: Stop[] }) {
  return (
    <Stack dir="v" gap="space.1" align="start">
      <span
        style={{
          fontSize: "var(--font-micro)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--color-text-muted)",
        }}
      >
        {label}
      </span>
      <Stack dir="h" gap="space.2" align="center" wrap={true}>
        {items.map((stop) => (
          <Pill key={stop.n} stop={stop} />
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
        <Pill stop={stops[0]} />
        <Group label="The spec: four levels" items={stops.slice(1, 5)} />
        <Group label="What it becomes" items={stops.slice(5, 8)} />
      </Stack>
    </nav>
  );
}
