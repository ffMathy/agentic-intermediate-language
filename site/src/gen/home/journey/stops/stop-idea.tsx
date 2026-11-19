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
      headline="It starts with what the product owner wants."
      explanation="Every AIL project starts with someone saying what they want, in plain words. Here a product owner asks for Tic-Tac-Toe, with six requirements. We follow one of them, “The computer never loses.”, all the way down to the code and the game. Nothing here is technical yet, and it shouldn't be."
      lines={[
        "Tic-Tac-Toe: a quick, familiar game people can finish in under a minute,",
        "alone or with a friend on the same device.",
        "1. Two players take turns placing their mark on a 3 × 3 board.",
        "2. Three marks in a line wins; a full board with no winner is a draw.",
        "3. You can play against a friend or against the computer.",
        "4. The computer never loses.",
        "5. You can start a new game at any time.",
        "6. You can watch the computer play itself, move by move.",
      ]}
      label="What the product owner asked for"
      file="examples/tictactoe/ail/tictactoe.ail.md"
      highlight={["4. The computer never loses."]}
      turnsInto="These words go into the spec unchanged, at the top of the tree. Next, each requirement gets a node that will make it true."
      figure={<IdeaFigure />}
      browse="#spec/tictactoe/tictactoe.ail.md"
    />
  );
}
