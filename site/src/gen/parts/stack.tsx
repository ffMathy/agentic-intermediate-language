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

function tokenVar(name: string): string {
  return `var(--${name.split(".").join("-")})`;
}

function alignItems(align: StackProps["align"]): CSSProperties["alignItems"] {
  if (align === "start") return "flex-start";
  if (align === "center") return "center";
  if (align === "end") return "flex-end";
  return "stretch";
}

function justifyContent(justify: StackProps["justify"]): CSSProperties["justifyContent"] {
  if (justify === "start") return "flex-start";
  if (justify === "center") return "center";
  if (justify === "between") return "space-between";
  return "flex-start";
}

/** "lays out its children in a column or a row, in the order given, with an even gap between them" */
export function Stack({ dir, gap, align, justify, wrap, pad, style, children }: StackProps) {
  const base: CSSProperties = {
    display: "flex",
    flexDirection: dir === "v" ? "column" : "row",
    alignItems: alignItems(align),
    justifyContent: justifyContent(justify),
    flexWrap: wrap === true ? "wrap" : "nowrap",
  };
  if (gap !== undefined) base.gap = tokenVar(gap);
  if (pad !== undefined) base.padding = tokenVar(pad);
  return <div style={{ ...base, ...style }}>{children}</div>;
}
