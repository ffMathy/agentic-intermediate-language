import type { CSSProperties } from "react";

const label =
  "An existing app is described by an AIL spec, which builds a new app; the same checks pass on both";
const passText = "✓ the same checks pass on both";

const sans = "var(--font-sans)";
const display = "var(--font-display)";

const sideBox: CSSProperties = {
  fill: "var(--color-surface)",
  stroke: "var(--color-border)",
  strokeWidth: 2,
};

const specBox: CSSProperties = {
  fill: "var(--color-code)",
};

const arrowLine: CSSProperties = {
  stroke: "var(--color-accent)",
  strokeWidth: 3,
};

const arrowHead: CSSProperties = {
  fill: "var(--color-accent)",
};

const checksPath: CSSProperties = {
  fill: "none",
  stroke: "var(--color-pass)",
  strokeWidth: 2,
  strokeDasharray: "6 6",
};

const passRect: CSSProperties = {
  fill: "var(--color-pass)",
};

const passLabel: CSSProperties = {
  textAnchor: "middle",
  fontSize: 14,
  fontWeight: 700,
  fill: "var(--color-on-accent)",
  fontFamily: sans,
};

function titleStyle(fontSize: number, fill: string, fontFamily: string): CSSProperties {
  return {
    textAnchor: "middle",
    fontSize,
    fontWeight: 700,
    fill,
    fontFamily,
  };
}

function subStyle(fontSize: number, fill: string): CSSProperties {
  return {
    textAnchor: "middle",
    fontSize,
    fill,
    fontFamily: sans,
  };
}

function arrowLabel(textAnchor: "middle" | "start"): CSSProperties {
  return {
    textAnchor,
    fontSize: 13,
    fontWeight: 600,
    fill: "var(--color-accent)",
    fontFamily: sans,
  };
}

/** three boxes in a row, "Your app today", "AIL spec" and "Your app, rebuilt", joined by arrows; below 600px viewport width the three boxes are stacked in a column, joined by downward arrows */
export function AdoptFigure() {
  return (
    <>
      <svg
        className="ail-wide"
        role="img"
        aria-label={label}
        viewBox="0 0 960 240"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <rect x={20} y={40} width={240} height={120} rx={12} style={sideBox} />
        <rect x={360} y={40} width={240} height={120} rx={12} style={specBox} />
        <rect x={700} y={40} width={240} height={120} rx={12} style={sideBox} />
        <text x={140} y={92} style={titleStyle(20, "var(--color-text)", sans)}>
          Your app today
        </text>
        <text x={480} y={92} style={titleStyle(20, "var(--color-thread)", display)}>
          AIL spec
        </text>
        <text x={820} y={92} style={titleStyle(20, "var(--color-text)", sans)}>
          Your app, rebuilt
        </text>
        <text x={140} y={122} style={subStyle(14, "var(--color-text-muted)")}>
          any stack
        </text>
        <text x={480} y={122} style={subStyle(14, "var(--color-code-text)")}>
          why · what · how
        </text>
        <text x={820} y={122} style={subStyle(14, "var(--color-text-muted)")}>
          any stack
        </text>
        <line x1={268} y1={100} x2={350} y2={100} style={arrowLine} />
        <path d="M340 92 L354 100 L340 108 Z" style={arrowHead} />
        <line x1={608} y1={100} x2={690} y2={100} style={arrowLine} />
        <path d="M680 92 L694 100 L680 108 Z" style={arrowHead} />
        <text x={309} y={84} style={arrowLabel("middle")}>
          adopt
        </text>
        <text x={649} y={84} style={arrowLabel("middle")}>
          build
        </text>
        <path d="M140 160 V196 H820 V160" style={checksPath} />
        <rect x={330} y={182} width={300} height={30} rx={15} style={passRect} />
        <text x={480} y={202} style={passLabel}>
          {passText}
        </text>
      </svg>
      <svg
        className="ail-narrow"
        role="img"
        aria-label={label}
        viewBox="0 0 300 432"
        style={{ width: "100%", maxWidth: "340px", height: "auto", margin: "0 auto" }}
      >
        <rect x={40} y={4} width={220} height={72} rx={12} style={sideBox} />
        <rect x={40} y={154} width={220} height={72} rx={12} style={specBox} />
        <rect x={40} y={304} width={220} height={72} rx={12} style={sideBox} />
        <text x={150} y={36} style={titleStyle(17, "var(--color-text)", sans)}>
          Your app today
        </text>
        <text x={150} y={58} style={subStyle(13, "var(--color-text-muted)")}>
          any stack
        </text>
        <text x={150} y={186} style={titleStyle(17, "var(--color-thread)", display)}>
          AIL spec
        </text>
        <text x={150} y={208} style={subStyle(13, "var(--color-code-text)")}>
          why · what · how
        </text>
        <text x={150} y={336} style={titleStyle(17, "var(--color-text)", sans)}>
          Your app, rebuilt
        </text>
        <text x={150} y={358} style={subStyle(13, "var(--color-text-muted)")}>
          any stack
        </text>
        <line x1={150} y1={84} x2={150} y2={140} style={arrowLine} />
        <path d="M142 132 L150 146 L158 132 Z" style={arrowHead} />
        <line x1={150} y1={234} x2={150} y2={290} style={arrowLine} />
        <path d="M142 282 L150 296 L158 282 Z" style={arrowHead} />
        <text x={162} y={116} style={arrowLabel("start")}>
          adopt
        </text>
        <text x={162} y={266} style={arrowLabel("start")}>
          build
        </text>
        <path d="M40 40 H18 V340 H40" style={checksPath} />
        <rect x={10} y={396} width={280} height={32} rx={16} style={passRect} />
        <text x={150} y={417} style={passLabel}>
          {passText}
        </text>
      </svg>
    </>
  );
}
