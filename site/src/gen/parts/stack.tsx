import type { CSSProperties, ReactNode } from "react";

/** "dir: "v" | "h", gap?: token name, align?: "start" | "center" | "end" | "stretch", justify?: "start" | "center" | "between", wrap?: boolean, pad?: token name, style?: extra inline style, children" */
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

const alignItems = (align: StackProps["align"]): string => {
  if (align === "start") return "flex-start";
  if (align === "center") return "center";
  if (align === "end") return "flex-end";
  return "stretch";
};

const justifyContent = (justify: StackProps["justify"]): string => {
  if (justify === "start") return "flex-start";
  if (justify === "center") return "center";
  if (justify === "between") return "space-between";
  return "flex-start";
};

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
