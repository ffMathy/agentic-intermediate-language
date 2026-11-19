import type { ReactNode } from "react";
import { Stack } from "./stack";

/** a full-width band with a centered content column; anchor links can land on it by its id */
export function Section({
  id,
  tone,
  label,
  children,
}: {
  id?: string;
  tone: "plain" | "raised";
  label?: string;
  children?: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      style={{
        boxSizing: "border-box",
        paddingTop: "var(--space-16)",
        paddingBottom: "var(--space-16)",
        paddingLeft: "var(--space-4)",
        paddingRight: "var(--space-4)",
        background:
          tone === "raised"
            ? "var(--color-surface-raised)"
            : "var(--color-surface)",
        scrollMarginTop: "var(--space-4)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--width-content)",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Stack dir="v" gap="space.8" align="stretch">
          {children}
        </Stack>
      </div>
    </section>
  );
}
