import { JourneyStop } from "../journey-stop";
import { ResultFrame } from "./result-frame";

/** the last stop, in the accent color; its rail ends at its marker, and its figure is the playable game */
export function StopResult() {
  return (
    <JourneyStop
      number={8}
      color="color.accent"
      depth="result"
      chip="RESULT"
      reader="players"
      headline="The result: try to beat it."
      explanation="This is the game built from that spec, running right here. Pick Computer, then play as X. You can draw, but you can't win: a check proved it before this page was published."
      lines={["    4. The computer never loses."]}
      label="The promise, one last time"
      file="examples/tictactoe/ail/tictactoe.ail.md"
      highlight={["The computer never loses."]}
      turnsInto="Every square, word and move in this game comes from the spec above. Apart from a short index.html, none of its code was written by hand."
      figure={<ResultFrame />}
      last={true}
      browse="#spec/tictactoe/tictactoe.ail.md"
    />
  );
}
