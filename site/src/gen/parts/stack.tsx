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

const tokenVar = (name: string): string => `var(--${name.replace(/\./g, "-")})`;

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
  const box: CSSProperties = {
    display: "flex",
    flexDirection: dir === "v" ? "column" : "row",
    gap: gap !== undefined ? tokenVar(gap) : undefined,
    alignItems: (align !== undefined && alignMap[align]) || "stretch",
    justifyContent: (justify !== undefined && justifyMap[justify]) || "flex-start",
    flexWrap: wrap === true ? "wrap" : "nowrap",
    padding: pad !== undefined ? tokenVar(pad) : undefined,
    ...style,
  };
  return <div style={box}>{children}</div>;
}
