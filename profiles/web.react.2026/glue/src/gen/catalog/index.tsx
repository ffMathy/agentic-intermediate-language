// Catalog components for profile web.react.2026. Copied in by `ail glue`. Do not edit.
import type { CSSProperties, ReactNode } from "react";

const v = (token: string) => `var(--${token.replace(/\./g, "-")})`;

export type Token = string;

/** stack(dir, gap, align, pad) */
export function Stack(props: { dir: "v" | "h"; gap?: Token; align?: "start" | "center" | "end" | "stretch"; pad?: Token; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: props.dir === "v" ? "column" : "row",
        gap: props.gap ? v(props.gap) : undefined,
        alignItems: props.align === "start" ? "flex-start" : props.align === "end" ? "flex-end" : props.align ?? "stretch",
        padding: props.pad ? v(props.pad) : undefined,
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
}

const textStyles: Record<"title" | "status" | "mark" | "body", CSSProperties> = {
  title: { fontSize: v("font.title"), fontWeight: 700, color: v("color.text") },
  status: { fontSize: v("font.status"), fontWeight: 600, color: v("color.text") },
  mark: { fontSize: v("font.mark"), fontWeight: 800, lineHeight: 1 },
  body: { fontSize: v("font.body"), color: v("color.text") },
};

/** Text.title | Text.status | Text.mark | Text.body */
export function Text(props: { variant: "title" | "status" | "mark" | "body"; color?: Token; align?: "start" | "center"; live?: "polite"; children?: ReactNode }) {
  return (
    <span
      aria-live={props.live}
      style={{ ...textStyles[props.variant], ...(props.color ? { color: v(props.color) } : {}), textAlign: props.align, display: "block" }}
    >
      {props.children}
    </span>
  );
}

/** Button.primary | Button.primary.lg | Button.secondary */
export function Button(props: { variant: "primary" | "secondary"; size?: "md" | "lg"; label?: string; width?: "auto" | "fill"; disabled?: boolean; onPress: () => void; children?: ReactNode }) {
  const primary = props.variant === "primary";
  return (
    <button
      type="button"
      aria-label={props.label}
      disabled={props.disabled}
      onClick={props.onPress}
      style={{
        font: "inherit",
        fontSize: props.size === "lg" ? v("font.status") : v("font.body"),
        fontWeight: 600,
        padding: props.size === "lg" ? `${v("space.3")} ${v("space.6")}` : `${v("space.2")} ${v("space.4")}`,
        borderRadius: v("radius.md"),
        border: `1px solid ${primary ? v("color.action") : v("color.border")}`,
        background: primary ? v("color.action") : v("color.surface"),
        color: primary ? v("color.action.text") : v("color.text"),
        width: props.width === "fill" ? "100%" : undefined,
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.5 : 1,
      }}
    >
      {props.children}
    </button>
  );
}

/** Segmented: a single-choice control rendered as a radio group. */
export function Segmented<T extends string>(props: { label: string; options: { value: T; label: string }[]; value: T; onChange: (value: T) => void; width?: "auto" | "fill" }) {
  return (
    <div
      role="radiogroup"
      aria-label={props.label}
      style={{
        display: "flex",
        width: props.width === "fill" ? "100%" : undefined,
        border: `1px solid ${v("color.border")}`,
        borderRadius: v("radius.md"),
        padding: v("space.1"),
        gap: v("space.1"),
        background: v("color.surface.raised"),
      }}
    >
      {props.options.map((o) => {
        const selected = o.value === props.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => props.onChange(o.value)}
            style={{
              flex: 1,
              font: "inherit",
              padding: `${v("space.2")} ${v("space.4")}`,
              borderRadius: v("radius.md"),
              border: "none",
              background: selected ? v("color.surface") : "transparent",
              color: selected ? v("color.text") : v("color.text.muted"),
              fontWeight: selected ? 600 : 400,
              cursor: "pointer",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Spinner.sm */
export function Spinner(props: { size: "sm"; label: string }) {
  return (
    <span
      role="status"
      aria-label={props.label}
      style={{
        display: "inline-block",
        width: v("space.4"),
        height: v("space.4"),
        borderRadius: v("radius.full"),
        border: `2px solid ${v("color.border")}`,
        borderTopColor: v("color.text"),
        animation: "ail-spin 0.8s linear infinite",
      }}
    />
  );
}

export { v as tokenVar };
