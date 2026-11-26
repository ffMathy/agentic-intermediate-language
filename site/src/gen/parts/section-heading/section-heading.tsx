import { Stack } from "../stack/stack";

/** shows the eyebrow when given, the text as a level 2 heading, and the lead when given, in that order */
export function SectionHeading({
  text,
  eyebrow,
  lead,
}: {
  text: string;
  eyebrow?: string;
  lead?: string;
}) {
  return (
    <Stack dir="v" gap="space.3" align="start">
      {eyebrow !== undefined ? (
        <p
          style={{
            fontSize: "var(--font-tiny)",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "var(--color-accent)",
            margin: 0,
          }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--font-heading)",
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
          color: "var(--color-text)",
          margin: 0,
        }}
      >
        {text}
      </h2>
      {lead !== undefined ? (
        <p
          style={{
            fontSize: "var(--font-lead)",
            lineHeight: 1.6,
            color: "var(--color-text-muted)",
            maxWidth: "var(--width-prose)",
            margin: 0,
          }}
        >
          {lead}
        </p>
      ) : null}
    </Stack>
  );
}
