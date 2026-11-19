import { Section } from "../../parts/section";
import { Stack } from "../../parts/stack";
import { HeroFigure } from "./hero-figure";

/** an eyebrow, the page's only level 1 heading, a short explanation, three links and a note, beside a picture of the sentence sinking through the levels */
export function Hero() {
  return (
    <Section tone="plain">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
          gap: "var(--space-8)",
          alignItems: "center",
        }}
      >
        <Stack dir="v" gap="space.4" align="start">
          <p
            style={{
              fontSize: "var(--font-tiny)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--color-accent)",
              margin: 0,
            }}
          >
            A SPEC LANGUAGE FOR AI-BUILT SOFTWARE
          </p>
          <h1
            style={{
              fontSize: "var(--font-hero)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--color-text)",
              margin: 0,
              maxWidth: "16ch",
            }}
          >
            Write one sentence. Watch it become working software.
          </h1>
          <p
            style={{
              fontSize: "var(--font-lead)",
              lineHeight: 1.6,
              color: "var(--color-text-muted)",
              maxWidth: "52ch",
              margin: 0,
            }}
          >
            AIL is a spec language for building software with AI agents. You write what you want in plain words, then refine it level by level until it is precise enough that any model builds the same behaviour, and checks prove the code does what the sentence says. Below, one real sentence goes all the way down.
          </p>
          <Stack dir="h" gap="space.3" align="center" wrap={true}>
            <a
              href="#journey"
              style={{
                background: "var(--color-accent)",
                color: "var(--color-on-accent)",
                border: "2px solid var(--color-accent)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-3) var(--space-6)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Follow the sentence ↓
            </a>
            <a
              href="./demo/"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-accent)",
                border: "2px solid var(--color-accent)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-3) var(--space-6)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Play the finished game
            </a>
            <a
              href="https://github.com/ffMathy/agentic-intermediate-language"
              style={{
                color: "var(--color-text)",
                fontWeight: 600,
                padding: "var(--space-3) var(--space-2)",
                textDecoration: "none",
              }}
            >
              View on GitHub ↗
            </a>
          </Stack>
          <p
            style={{
              fontSize: "var(--font-small)",
              color: "var(--color-text-muted)",
              margin: 0,
            }}
          >
            This website is itself written in AIL and compiled by the same tool.
          </p>
        </Stack>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <HeroFigure />
        </div>
      </div>
    </Section>
  );
}
