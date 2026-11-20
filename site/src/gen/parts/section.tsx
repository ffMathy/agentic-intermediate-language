import type { CSSProperties, ReactNode } from "react";
import { Stack } from "./stack";

export type SectionProps = {
  id?: string;
  tone: "plain" | "raised";
  label?: string;
  children?: ReactNode;
};

/** a full-width band with a centered content column; anchor links can land on it by its id */
export function Section({ id, tone, label, children }: SectionProps) {
  const band: CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    paddingTop: "var(--space-16)",
    paddingBottom: "var(--space-16)",
    paddingLeft: "var(--space-4)",
    paddingRight: "var(--space-4)",
    background:
      tone === "raised" ? "var(--color-surface-raised)" : "var(--color-surface)",
    scrollMarginTop: "var(--space-4)",
  };
  const column: CSSProperties = {
    maxWidth: "var(--width-content)",
    margin: "0 auto",
    width: "100%",
  };
  return (
    <section id={id} aria-label={label} style={band}>
      <div style={column}>
        <Stack dir="v" gap="space.8" align="stretch">
          {children}
        </Stack>
      </div>
    </section>
  );
}
