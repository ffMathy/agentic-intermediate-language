const steps = [
  { cx: 180, cy: 50, number: "1", name: "Write", color: "var(--color-level-product)" },
  { cx: 310, cy: 180, number: "2", name: "Build", color: "var(--color-level-build)" },
  { cx: 180, cy: 310, number: "3", name: "Check", color: "var(--color-step-check)" },
  { cx: 50, cy: 180, number: "4", name: "Ask", color: "var(--color-level-experience)" },
];

const heads = [
  "translate(272 88) rotate(45)",
  "translate(272 272) rotate(135)",
  "translate(88 272) rotate(225)",
  "translate(88 88) rotate(315)",
];

/** four colored circles on a ring, Write, Build, Check and Ask, with arrows going clockwise, and a padlock with "ail.lock.json" in the middle */
export function LoopFigure() {
  return (
    <svg
      viewBox="0 0 360 360"
      role="img"
      aria-label="Write, build, check and ask, in a loop around ail.lock.json"
      style={{
        width: "100%",
        maxWidth: "360px",
        height: "auto",
        display: "block",
        margin: "0 auto",
      }}
    >
      <circle
        cx={180}
        cy={180}
        r={130}
        fill="none"
        style={{ stroke: "var(--color-border)" }}
        strokeWidth={2}
      />
      {heads.map((transform) => (
        <path
          key={transform}
          d="M-6 -6 L6 0 L-6 6 Z"
          transform={transform}
          style={{ fill: "var(--color-text-muted)" }}
        />
      ))}
      {steps.map((step) => (
        <g key={step.name}>
          <circle cx={step.cx} cy={step.cy} r={32} style={{ fill: step.color }} />
          <text
            x={step.cx}
            y={step.cy - 8}
            textAnchor="middle"
            fontSize={11}
            fontWeight={700}
            opacity={0.85}
            style={{ fill: "var(--color-on-accent)", fontFamily: "var(--font-sans)" }}
          >
            {step.number}
          </text>
          <text
            x={step.cx}
            y={step.cy + 10}
            textAnchor="middle"
            fontSize={13}
            fontWeight={700}
            style={{ fill: "var(--color-on-accent)", fontFamily: "var(--font-sans)" }}
          >
            {step.name}
          </text>
        </g>
      ))}
      <rect
        x={166}
        y={176}
        width={28}
        height={22}
        rx={4}
        style={{ fill: "var(--color-text-muted)" }}
      />
      <path
        d="M172 176 V168 A8 8 0 0 1 188 168 V176"
        fill="none"
        strokeWidth={3}
        style={{ stroke: "var(--color-text-muted)" }}
      />
      <text
        x={180}
        y={218}
        textAnchor="middle"
        fontSize={12}
        style={{ fill: "var(--color-text)", fontFamily: "var(--font-mono)" }}
      >
        ail.lock.json
      </text>
    </svg>
  );
}
