import type { CSSProperties, ReactNode } from "react";

export type StackProps = {
  dir: "v" | "h";
  gap?: string;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "between";
  wrap?: boolean;
  pad?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const tokenVar = (name: string): string => `var(--${name.split(".").join("-")})`;

const alignMap: Record<string, CSSProperties["alignItems"]> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
};

const justifyMap: Record<string, CSSProperties["justifyContent"]> = {
  start: "flex-start",
  center: "center",
  between: "space-between",
};

/** "lays out its children in a column or a row, in the order given, with an even gap between them" */
export function Stack({ dir, gap, align, justify, wrap, pad, style, children }: StackProps) {
  const base: CSSProperties = {
    display: "flex",
    flexDirection: dir === "v" ? "column" : "row",
    alignItems: (align !== undefined && alignMap[align]) || "stretch",
    justifyContent: (justify !== undefined && justifyMap[justify]) || "flex-start",
    flexWrap: wrap === true ? "wrap" : "nowrap",
  };
  if (gap !== undefined) {
    base.gap = tokenVar(gap);
  }
  if (pad !== undefined) {
    base.padding = tokenVar(pad);
  }
  return <div style={{ ...base, ...style }}>{children}</div>;
}
