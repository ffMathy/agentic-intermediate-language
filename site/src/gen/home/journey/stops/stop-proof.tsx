import { JourneyStop } from "../journey-stop";
import { ProofFigure } from "./proof-figure";

/** the seventh stop, in the build color, showing the derived check */
export function StopProof() {
  return (
    <JourneyStop
      number={7}
      color="color.level.build"
      depth="proof"
      chip="PROOF"
      reader="everyone: a green check means the sentence at the top is true"
      headline="Proof: the verify line becomes a test that plays every game."
      explanation="The verify line from the specialist level was turned into a derived check, pinned to a hash of the node. It tries every possible sequence of X moves against the computer and asserts that X never wins. Every ail build runs it with every other example and scenario, on your machine and in CI."
      lines={[
        "// ail-derived-from: ComputerPlayer@0c990bfbddc62e20",
        "test(\"never loses\", () => {",
        "  …",
        "  explore(Array(9).fill(null), \"X\");",
        "  expect(games).toBeGreaterThan(0);",
        "  expect(xWins).toBe(0);",
        "});",
      ]}
      label="Derived check excerpt"
      file="examples/tictactoe/checks/engine/computer-player/computer-player.test.ts"
      highlight={["never loses", "expect(xWins).toBe(0);"]}
      turnsInto="A green ail build. If a change to the spec or the code ever let X win, the check would fail and the change would be rejected."
      figure={<ProofFigure />}
    />
  );
}
