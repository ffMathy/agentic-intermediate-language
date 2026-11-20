import { JourneyStop } from "../journey-stop";
import { ProofScreens } from "./proof-screens";

/** the seventh stop, in the build color, showing the derived check, and screenshots of the screens the demo's checks end on */
export function StopProof() {
  return (
    <JourneyStop
      number={7}
      color="color.level.build"
      depth="proof"
      chip="PROOF"
      reader="everyone: a green check means the sentence at the top is true"
      headline="Proof: the verify line becomes a test that plays every game."
      explanation="The verify line from the specialist level became a derived check, pinned to a hash of the node: it plays every possible game against the computer and asserts that X never wins. What people see is proven too. The final screen of every check is screenshotted, a model compares it with the spec's look, and the screenshots are committed next to the checks, so a reviewer sees exactly what was proven. Every ail build runs it all, on your machine and in CI."
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
      turnsInto="A green ail build, and committed screenshots of what it proved. If a change to the spec or the code ever let X win, or changed how the game looks, the build would fail and the change would be rejected."
      figure={<ProofScreens />}
    />
  );
}
