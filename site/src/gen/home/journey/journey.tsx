import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { Stack } from "../../parts/stack";
import { JumpGauge } from "./jump-gauge";
import { StopIdea } from "./stops/stop-idea";
import { StopProduct } from "./stops/stop-product";
import { StopExperience } from "./stops/stop-experience";
import { StopSystem } from "./stops/stop-system";
import { StopSpecialist } from "./stops/stop-specialist";
import { StopBuild } from "./stops/stop-build";
import { StopProof } from "./stops/stop-proof";
import { StopResult } from "./stops/stop-result";

/** "a heading, an introduction, a legend for the yellow thread, a map of the stops, then eight stops in order" */
export function Journey() {
  return (
    <Section id="journey" tone="plain">
      <SectionHeading
        eyebrow="THE JOURNEY"
        text="Follow one sentence all the way down"
        lead="This is the real spec of the Tic-Tac-Toe demo, not a mock-up. We follow one of the product owner's requirements for Tic-Tac-Toe, “the computer never loses”, down to the code that keeps it. Stops 2 to 5 are the four levels of the spec, from plain promise to algorithm. Stops 6 to 8 are what the tools make from it: the code, the proof and the game. The yellow highlight marks the thread at every level."
      />
      <Stack dir="h" gap="space.2" align="center">
        <span
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "3px",
            background: "var(--color-thread)",
            border: "1px solid var(--color-thread-strong)",
          }}
        />
        <span
          style={{
            fontSize: "var(--font-small)",
            color: "var(--color-text-muted)",
          }}
        >
          the thread we are following
        </span>
      </Stack>
      <JumpGauge />
      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        <li>
          <StopIdea />
        </li>
        <li>
          <StopProduct />
        </li>
        <li>
          <StopExperience />
        </li>
        <li>
          <StopSystem />
        </li>
        <li>
          <StopSpecialist />
        </li>
        <li>
          <StopBuild />
        </li>
        <li>
          <StopProof />
        </li>
        <li>
          <StopResult />
        </li>
      </ol>
    </Section>
  );
}
