import { JourneyStop } from "../journey-stop";
import { SystemFigure } from "./system-figure";

/** the fourth stop, in the system color */
export function StopSystem() {
  return (
    <JourneyStop
      number={4}
      color="color.level.system"
      depth="depth 3"
      chip="SYSTEM"
      reader="engineers"
      headline="System level: one exact shape, one exact rule, examples that run."
      explanation="To prove anything about every game, the engine needs one exact board and one definition of a win. Prose gives way to types and examples, and every example line becomes a unit test, word for word. Playing and watching share this engine, so they can never disagree."
      lines={[
        "node Rules : fn   level: system",
        "  why   The one definition of a win and a draw.   <- Engine",
        "  what",
        "    LINES: list of list of integer = [[0,1,2], [3,4,5], [6,7,8], …]",
        "    evaluate(board: Board) -> Status",
        "      the first line in LINES order whose three cells hold the same mark → won(mark, line)",
        "      otherwise, if every cell is filled → draw",
        "      otherwise → playing",
        "    tie-break: when one move completes two lines, the winning line is the first in LINES order",
        "    examples",
        "      evaluate(boardFrom(\"XXX/OO_/___\")) => ({ kind: \"won\", mark: \"X\", line: [0, 1, 2] })",
        "      …",
        "      evaluate(boardFrom(\"XOX/XOO/OXX\")) => ({ kind: \"draw\" })",
        "      LINES.length => 8",
        "  uses  GameState",
      ]}
      label="System-level spec excerpt"
      file="examples/tictactoe/ail/engine/rules.ail.md"
      highlight={["evaluate(board: Board) -> Status"]}
      turnsInto="rules.ts, plus one unit test per example line. ComputerPlayer looks ahead with these same rules."
      figure={<SystemFigure />}
      browse="#spec/tictactoe/engine/rules.ail.md"
    />
  );
}
