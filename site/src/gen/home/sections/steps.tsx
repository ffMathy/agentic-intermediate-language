import { Stack, Text } from "../../catalog";
import { SectionHeading } from "../../parts/section-heading";

const steps = [
  {
    number: 1,
    title: "Spec",
    text: "Describe why, what and how as a tree of nodes, from plain product claims down to precise contracts.",
  },
  {
    number: 2,
    title: "Build",
    text: "An agent compiles each node from its own slice of the spec: nothing outside it, nothing left to guess.",
  },
  {
    number: 3,
    title: "Check",
    text: "Every example and scenario in the spec runs against the result, and unchanged nodes are never rebuilt.",
  },
];

/** Steps: a heading, then three steps; each step has a number, a title and one sentence. */
export function Steps() {
  return (
    <Stack dir="v" gap="space.4" align="stretch">
      <SectionHeading text="Spec, build, check" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {steps.map((step) => (
          <div
            key={step.number}
            style={{
              background: "var(--color-surface-raised)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-4)",
            }}
          >
            <Stack dir="v" gap="space.2" align="start">
              <span style={{ fontSize: "var(--font-heading)", fontWeight: 800, color: "var(--color-accent)" }}>
                {step.number}
              </span>
              <span style={{ fontWeight: 700 }}>
                <Text variant="body">{step.title}</Text>
              </span>
              <span style={{ color: "var(--color-text-muted)" }}>
                <Text variant="body">{step.text}</Text>
              </span>
            </Stack>
          </div>
        ))}
      </div>
    </Stack>
  );
}
