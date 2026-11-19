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
      reader="a product owner, in their own words"
      headline="It starts as a sentence anyone could say."
      explanation="Every AIL project starts with someone saying what they want, in plain words. Here it's a game people can finish in under a minute, and a promise that the built-in opponent can't be beaten. Those words go into the spec just as they were said, at the top of the tree. Nothing here is technical yet, and it shouldn't be."
      lines={[
        "  why   A quick, familiar game people can finish in under a minute,",
        "        alone or with a friend on the same device.",
        "  …",
        "    4. The computer never loses.",
      ]}
      label="The idea, at the top of the spec"
      file="examples/tictactoe/tictactoe.ail.md"
      highlight={["The computer never loses."]}
      turnsInto="The owner's words, written down unchanged as the spec's first lines. Next, the sentence joins the product's other promises and gets a node that keeps it."
      figure={<IdeaFigure />}
    />
  );
}
