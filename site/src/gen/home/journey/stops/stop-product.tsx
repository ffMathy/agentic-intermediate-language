import { JourneyStop } from "../journey-stop";
import { ProductFigure } from "./product-figure";

/** the second stop, in the product color */
export function StopProduct() {
  return (
    <JourneyStop
      number={2}
      color="color.level.product"
      depth="depth 1"
      chip="PRODUCT"
      reader="anyone: stakeholders, customers, the whole team"
      headline="Product level: the sentence becomes a promise with an owner."
      explanation="In the root node, the sentence sits beside five other promises. Each one must name a deeper node that makes it true, and a check rejects code notation at this level, so anyone can review it."
      lines={[
        "node TicTacToe : system   level: product",
        "  …",
        "  what",
        "    1. Two players take turns placing their mark on a 3 × 3 board.          refined-by: PlayAGame",
        "    2. Three marks in a line wins; a full board with no winner is a draw.   refined-by: Rules",
        "    3. You can play against a friend or against the computer.               refined-by: ChooseOpponent",
        "    4. The computer never loses.                                            refined-by: ComputerPlayer",
        "    5. You can start a new game at any time.                                refined-by: NewGameButton",
        "    6. You can watch the computer play itself, move by move.                refined-by: WatchADemo",
        "  entry     App",
        "  children  App, BoardKit, Engine, UiKit",
      ]}
      label="Product-level spec excerpt"
      file="examples/tictactoe/tictactoe.ail.md"
      highlight={["4. The computer never loses.", "refined-by: ComputerPlayer"]}
      turnsInto="Nothing is built from this level directly. Each refined-by names the node that will be: for claim 4, ComputerPlayer."
      figure={<ProductFigure />}
    />
  );
}
