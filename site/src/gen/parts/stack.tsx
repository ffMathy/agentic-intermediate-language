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

const tokenVar = (token: string): string => `var(--${token.split(".").join("-")})`;

const alignMap: Record<string, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
};

const justifyMap: Record<string, string> = {
  start: "flex-start",
  center: "center",
  between: "space-between",
};

/** "lays out its children in a column or a row, in the order given, with an even gap between them" */
export function Stack({ dir, gap, align, justify, wrap, pad, style, children }: StackProps) {
  const base: CSSProperties = {
    display: "flex",
    flexDirection: dir === "v" ? "column" : "row",
    gap: gap !== undefined ? tokenVar(gap) : undefined,
    alignItems: align !== undefined && align in alignMap ? alignMap[align] : "stretch",
    justifyContent: justify !== undefined && justify in justifyMap ? justifyMap[justify] : "flex-start",
    flexWrap: wrap === true ? "wrap" : "nowrap",
    padding: pad !== undefined ? tokenVar(pad) : undefined,
  };
  return <div style={{ ...base, ...style }}>{children}</div>;
}
