import { JourneyStop } from "../../journey-stop/journey-stop";
import { BuildFigure } from "./build-figure/build-figure";

/** the sixth stop, in the build color, showing the start and end of the generated file */
export function StopBuild() {
  return (
    <JourneyStop
      number={6}
      color="color.level.build"
      depth="build"
      chip="BUILD"
      reader="nobody has to: an agent writes it, and reviewers may skim it"
      headline="Build: an agent compiles the node, seeing only its own slice."
      explanation="ail build hands this node, plus only the contracts of the nodes it uses, to a compiler agent. If something important were left open, the agent would stop and ask instead of guessing. It writes one TypeScript file whose doc comment quotes the clause it implements, and the lock file records a hash of exactly what it saw, so a later hand edit is caught."
      lines={[
        "/** choose(board: Board, me: Mark = \"O\") -> number — full minimax over the remaining game tree, memoized by board; among equally scored moves, the lowest index */",
        "export function choose(board: Board, me: Mark = \"O\"): number {",
        "  let bestIndex = -1;",
        "  let bestScore = -Infinity;",
        "  …",
        "  return bestIndex;",
        "}",
      ]}
      label="Generated code excerpt"
      file="examples/tictactoe/src/gen/engine/computer-player/computer-player.ts (generated, never edited by hand)"
      highlight={["export function choose"]}
      turnsInto="One generated file of 69 lines. A reviewer reads the 27-line node instead."
      figure={<BuildFigure />}
    />
  );
}
