/** three boxes in a row, "Your app today", "AIL spec" and "Your app, rebuilt", joined by arrows; the spec box in the middle is dark like the code panels, and under the row a line says the same checks pass on both */
export function AdoptFigure() {
  return (
    <svg
      viewBox="0 0 960 240"
      role="img"
      aria-label="An existing app is described by an AIL spec, which builds a new app; the same checks pass on both"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <rect
        x={20}
        y={40}
        width={240}
        height={120}
        rx={12}
        strokeWidth={2}
        style={{ fill: "var(--color-surface)", stroke: "var(--color-border)" }}
      />
      <rect
        x={360}
        y={40}
        width={240}
        height={120}
        rx={12}
        style={{ fill: "var(--color-code)" }}
      />
      <rect
        x={700}
        y={40}
        width={240}
        height={120}
        rx={12}
        strokeWidth={2}
        style={{ fill: "var(--color-surface)", stroke: "var(--color-border)" }}
      />
      <text
        x={140}
        y={92}
        textAnchor="middle"
        fontSize={20}
        fontWeight={700}
        style={{ fill: "var(--color-text)", fontFamily: "var(--font-sans)" }}
      >
        Your app today
      </text>
      <text
        x={480}
        y={92}
        textAnchor="middle"
        fontSize={20}
        fontWeight={700}
        style={{ fill: "var(--color-thread)", fontFamily: "var(--font-display)" }}
      >
        AIL spec
      </text>
      <text
        x={820}
        y={92}
        textAnchor="middle"
        fontSize={20}
        fontWeight={700}
        style={{ fill: "var(--color-text)", fontFamily: "var(--font-sans)" }}
      >
        Your app, rebuilt
      </text>
      <text
        x={140}
        y={122}
        textAnchor="middle"
        fontSize={14}
        style={{ fill: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
      >
        any stack
      </text>
      <text
        x={480}
        y={122}
        textAnchor="middle"
        fontSize={14}
        style={{ fill: "var(--color-code-text)", fontFamily: "var(--font-sans)" }}
      >
        why · what · how
      </text>
      <text
        x={820}
        y={122}
        textAnchor="middle"
        fontSize={14}
        style={{ fill: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
      >
        any stack
      </text>
      <line
        x1={268}
        y1={100}
        x2={350}
        y2={100}
        strokeWidth={3}
        style={{ stroke: "var(--color-accent)" }}
      />
      <path d="M340 92 L354 100 L340 108 Z" style={{ fill: "var(--color-accent)" }} />
      <line
        x1={608}
        y1={100}
        x2={690}
        y2={100}
        strokeWidth={3}
        style={{ stroke: "var(--color-accent)" }}
      />
      <path d="M680 92 L694 100 L680 108 Z" style={{ fill: "var(--color-accent)" }} />
      <text
        x={309}
        y={84}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        style={{ fill: "var(--color-accent)", fontFamily: "var(--font-sans)" }}
      >
        adopt
      </text>
      <text
        x={649}
        y={84}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        style={{ fill: "var(--color-accent)", fontFamily: "var(--font-sans)" }}
      >
        build
      </text>
      <path
        d="M140 160 V196 H820 V160"
        fill="none"
        strokeWidth={2}
        strokeDasharray="6 6"
        style={{ stroke: "var(--color-pass)" }}
      />
      <rect
        x={330}
        y={182}
        width={300}
        height={30}
        rx={15}
        style={{ fill: "var(--color-pass)" }}
      />
      <text
        x={480}
        y={202}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        style={{ fill: "var(--color-on-accent)", fontFamily: "var(--font-sans)" }}
      >
        ✓ the same checks pass on both
      </text>
    </svg>
  );
}
