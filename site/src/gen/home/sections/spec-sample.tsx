import { Stack, Text } from "../../catalog";
import { SectionHeading } from "../../parts/section-heading";
import { CodeBlock } from "../../parts/code-block";

/** SpecSample: a heading, one sentence, and the sample spec in a code block. */
export function SpecSample() {
  return (
    <Stack dir="v" gap="space.4" align="stretch">
      <SectionHeading text="What a spec looks like" />
      <span style={{ color: "var(--color-text-muted)" }}>
        <Text variant="body">Plain language at the top, detail and proof further down. This node is the root of the Tic-Tac-Toe demo.</Text>
      </span>
      <CodeBlock
        label="Sample spec"
        lines={[
          "node TicTacToe : system   level: product",
          "  why   A quick, familiar game people can finish in under a minute.",
          "  what",
          "    1. Two players take turns placing their mark.   refined-by: PlayAGame",
          "    4. The computer never loses.                    refined-by: ComputerPlayer",
          "    6. You can watch the computer play itself.      refined-by: WatchADemo",
          "  children  App, BoardKit, Engine",
        ]}
      />
    </Stack>
  );
}
