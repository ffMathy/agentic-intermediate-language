import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { Stack } from "../../parts/stack";
import { CopyCommand } from "../../parts/copy-command";
import { AdoptFigure } from "./adopt-figure";

const steps = [
  {
    number: "1",
    color: "var(--color-level-product)",
    title: "Why, from people and tickets",
    text: "The reasons come from the task tracker (Asana, Jira, Linear) and from interviewing the people who own the app. A reason nobody can confirm is written down as unknown, and every build lists it until someone answers.",
  },
  {
    number: "2",
    color: "var(--color-level-experience)",
    title: "What, from the running app",
    text: "An agent finds out how to start the app, whatever it is: a website, a mobile app on a simulator, a command-line tool. Then it drives every screen and error path, and writes down what it sees, quirks included.",
  },
  {
    number: "3",
    color: "var(--color-level-system)",
    title: "How, from the code",
    text: "The code tells what the screen can't: data shapes, rules, edge cases and timing. Real inputs and outputs become examples, and every claim records where it came from.",
  },
  {
    number: "4",
    color: "var(--color-pass)",
    title: "Proof, on the old app",
    text: "Every flow gets an end-to-end check that plays its scenarios. ail adopt starts the old app and runs them: when they pass, the spec describes the app.",
  },
];

const cards = [
  {
    title: "In Claude Code",
    cmd: "/ail:adopt",
    text: "Claude writes the spec one slice at a time: a screen, a flow or a rule. It asks you what only the owners know.",
  },
  {
    title: "In a terminal",
    cmd: "ail adopt",
    text: "Starts the app as ail.config.json says, runs every end-to-end check against it, and stops it.",
  },
];

/** "a heading, a picture of an old app and a new app checked against the same spec, four steps that write and prove the spec, and the two commands that do it" */
export function AdoptSection() {
  return (
    <Section id="adopt" tone="plain">
      <Stack dir="v" gap="space.6" align="stretch">
        <SectionHeading
          eyebrow="AIL IN REVERSE"
          text="Already have an app? Adopt it."
          lead="Most software already exists. AIL can write the spec of an app you already have, prove that the spec describes it, and from then on build it from that spec, on the same technology or a new one."
        />
        <div
          style={{
            background: "var(--color-surface-raised)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6)",
            overflow: "hidden",
          }}
        >
          <AdoptFigure />
        </div>
        <ol
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {steps.map((step) => (
            <li
              key={step.number}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-6)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-display)",
                  fontSize: "32px",
                  fontWeight: 800,
                  lineHeight: 1,
                  color: step.color,
                }}
              >
                {step.number}
              </span>
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
            </li>
          ))}
        </ol>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {cards.map((card) => (
            <section
              key={card.cmd}
              aria-label={card.title}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-6)",
                minWidth: 0,
              }}
            >
              <Stack dir="v" gap="space.3" align="stretch">
                <h3
                  style={{
                    fontSize: "var(--font-lead)",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    margin: 0,
                  }}
                >
                  {card.title}
                </h3>
                <CopyCommand command={card.cmd} />
                <p
                  style={{
                    fontSize: "var(--font-small)",
                    lineHeight: 1.6,
                    color: "var(--color-text-muted)",
                    margin: 0,
                  }}
                >
                  {card.text}
                </p>
              </Stack>
            </section>
          ))}
        </div>
        <p
          style={{
            fontSize: "var(--font-small)",
            lineHeight: 1.6,
            color: "var(--color-text-muted)",
            maxWidth: "var(--width-prose)",
            margin: 0,
          }}
        >
          To move to another technology, change the spec's target and build. Every build then runs the same end-to-end checks against the new app, so it is proven to behave like the old one.
        </p>
      </Stack>
    </Section>
  );
}
