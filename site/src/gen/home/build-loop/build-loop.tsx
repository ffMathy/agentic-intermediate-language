import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { Stack } from "../../parts/stack";
import { LoopFigure } from "./loop-figure";

const steps = [
  {
    number: "1",
    title: "Write",
    text: "Change the spec, in plain words or with Claude Code's help. Generated code is never edited by hand.",
    color: "var(--color-level-product)",
  },
  {
    number: "2",
    title: "Build",
    text: "ail build recompiles only the nodes whose slice changed: their own spec, the contracts of the nodes they use, or shared parts like the tokens. Each node is compiled by an agent that sees only that slice.",
    color: "var(--color-level-build)",
  },
  {
    number: "3",
    title: "Check",
    text: "ail check lints the spec, confirms every file was built from it, and runs every example, scenario and verify line as a test.",
    color: "var(--color-step-check)",
  },
  {
    number: "4",
    title: "Ask",
    text: "When the spec leaves a gap, the compiler doesn't guess. It replies STOP with a question, and the answer goes into the spec.",
    color: "var(--color-level-experience)",
  },
];

/** "a heading, a loop picture beside four numbered steps, and an example of a question the compiler asks instead of guessing" */
export function BuildLoop() {
  return (
    <Section id="loop" tone="plain">
      <Stack dir="v" gap="space.8" align="stretch">
        <SectionHeading
          text="How a spec becomes code you can trust"
          lead="Four steps, repeated for every change. You only ever edit the spec."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
            gap: "var(--space-8)",
            alignItems: "center",
          }}
        >
          <LoopFigure />
          <ol
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
            }}
          >
            {steps.map((step) => (
              <li
                key={step.title}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "var(--space-3)",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "var(--radius-pill)",
                    flex: "0 0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "var(--font-small)",
                    fontWeight: 800,
                    color: "var(--color-on-accent)",
                    background: step.color,
                  }}
                >
                  {step.number}
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-1)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "var(--font-lead)",
                      fontWeight: 700,
                      color: "var(--color-text)",
                      margin: 0,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--font-body)",
                      lineHeight: 1.6,
                      color: "var(--color-text-muted)",
                      margin: 0,
                    }}
                  >
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div
          style={{
            background: "var(--color-stop-soft)",
            border: "1px solid var(--color-level-experience)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-4)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--font-code)",
              color: "var(--color-text)",
              margin: 0,
            }}
          >
            <span style={{ fontWeight: 700, color: "var(--color-stop-text)" }}>
              STOP:
            </span>
            {" after switching to the computer, does “New game” keep the computer as the opponent?"}
          </p>
          <p
            style={{
              fontSize: "var(--font-small)",
              color: "var(--color-text-muted)",
              margin: "var(--space-2) 0 0",
            }}
          >
            Example question. In the real Tic-Tac-Toe spec the answer is already written down: “New game” keeps the opponent you chose (see the GameReducer node).
          </p>
        </div>
      </Stack>
    </Section>
  );
}
