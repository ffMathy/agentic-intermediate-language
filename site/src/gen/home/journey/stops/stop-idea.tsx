import { JourneyStop } from "../journey-stop";
import { IdeaFigure } from "./idea-figure";

/** the first stop, in the accent color, before any level of the spec */
export function StopIdea() {
  return (
    <JourneyStop
      number={1}
      color="color.accent"
      depth="idea"
      chip="IDEA"
      reader="a product owner, before any tools"
      headline="It starts as a sentence anyone could say."
      explanation="Every AIL project starts at the top of a tree, with plain promises. This one is a game people can finish in under a minute, and one of its promises is that the built-in opponent can't be beaten. Nothing here is technical yet, and it shouldn't be."
      lines={[
        "  why   A quick, familiar game people can finish in under a minute,",
        "        alone or with a friend on the same device.",
        "  …",
        "    4. The computer never loses.",
      ]}
      label="The idea, at the top of the spec"
      file="examples/tictactoe/tictactoe.ail.md"
      highlight={["The computer never loses."]}
      turnsInto="One promise at the top of the tree. The rest of this page follows it down."
      figure={<IdeaFigure />}
    />
  );
}
