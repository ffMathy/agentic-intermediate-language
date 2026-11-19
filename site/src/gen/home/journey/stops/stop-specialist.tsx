import { JourneyStop } from "../journey-stop";
import { SpecialistFigure } from "./specialist-figure";

/** the fifth stop, in the specialist color */
export function StopSpecialist() {
  return (
    <JourneyStop
      number={5}
      color="color.level.specialist"
      depth="depth 4"
      chip="SPECIALIST"
      reader="experts: here, someone who knows game search"
      headline="Specialist level: the promise becomes an algorithm and a proof."
      explanation="This is where “never loses” is made true. The node fixes the algorithm, the exact scoring, the tie-break and an invariant, and says how the promise will be checked. Rejected alternatives stay in the spec, so nobody argues them again."
      lines={[
        "node ComputerPlayer : fn   level: specialist   @ai",
        "  why   Make \"the computer never loses\" true and provable, while still answering instantly.   <- Engine",
        "  what",
        "    choose(board: Board, me: Mark = \"O\") -> number    — precondition: the game on board is still playing",
        "    scoring, from me's point of view, where d counts the moves from board to the end of the game, this one included:",
        "      me wins → 10 − d;  me loses → d − 10;  draw → 0",
        "    tie-break: among equally scored moves, the lowest index",
        "    invariant: whatever the other player does, no game against choose ends in a win for the other player",
        "  how",
        "    decide full minimax over the remaining game tree, memoized by board",
        "      because there are at most 5,478 legal positions; exact search takes well under a millisecond and makes \"never loses\" provable",
        "      rejected hand-written heuristics (centre, corners, block, fork) because they are hard to prove correct and easy to get subtly wrong",
        "  verify",
        "    never loses: from the empty board, play every possible sequence of X moves against choose as O",
        "                 and assert that no game ends in a win for X",
      ]}
      label="Specialist-level spec excerpt"
      file="examples/tictactoe/engine/computer-player/computer-player.ail.md"
      highlight={[
        "never loses",
        "no game against choose ends in a win for the other player",
      ]}
      turnsInto="A minimax search in TypeScript, and a check that plays every possible game against it."
      figure={<SpecialistFigure />}
    />
  );
}
