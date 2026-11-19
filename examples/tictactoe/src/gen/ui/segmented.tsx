import type { CSSProperties } from "react";

export type SegmentedOption<T> = {
  value: T;
  label: string;
};

export type SegmentedProps<T> = {
  label: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

const groupStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  padding: "var(--space-1)",
  gap: "var(--space-1)",
  background: "var(--color-surface-raised)",
};

const optionStyle: CSSProperties = {
  flex: "1 1 0",
  padding: "var(--space-2) var(--space-4)",
  borderRadius: "var(--radius-md)",
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "inherit",
};

const pickedStyle: CSSProperties = {
  ...optionStyle,
  background: "var(--color-surface)",
  color: "var(--color-text)",
  fontWeight: 600,
};

const otherStyle: CSSProperties = {
  ...optionStyle,
  background: "transparent",
  color: "var(--color-text-muted)",
  fontWeight: 400,
};

/** "a group of options with exactly one picked, named with its label" */
export function Segmented<T>({ label, options, value, onChange }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} style={groupStyle}>
      {options.map((option, index) => {
        const picked = option.value === value;
        return (
          <button
            key={index}
            type="button"
            role="radio"
            aria-checked={picked}
            style={picked ? pickedStyle : otherStyle}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
