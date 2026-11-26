# Stop 2: product level

More nodes in this folder, each in a file of its own: [`ProductFigure`](product-figure.ail.md).

```ail
node StopProduct : view   level: experience
  why   Show the product level: the owner's requirements become the promises at the root, and each promise names who keeps it.   <- Journey
  what
    the second stop, in the product color
    Scenario: the product level
      Given the page is open
      Then the article "stop-2" has the level 3 heading "Product level: each requirement becomes a promise with an owner."
      And the region named "Product-level spec excerpt" shows its eleven lines, with claim 4 and "refined-by: ComputerPlayer" highlighted
  look
    stop     JourneyStop with number 2, color color.level.product, figure ProductFigure, browse "#spec/tictactoe/tictactoe.ail.md"
  copy
    product.depth     "depth 1"
    product.chip      "PRODUCT"
    product.reader    "anyone: stakeholders, customers, the whole team"
    product.headline  "Product level: each requirement becomes a promise with an owner."
    product.body      "In the root node, the owner's six requirements become the product's promises, word for word. Each one must name a deeper node that makes it true, and a check rejects code notation at this level, so anyone can review it."
    product.label     "Product-level spec excerpt"
    product.file      "examples/tictactoe/ail/tictactoe.ail.md"
    product.line.1    "node TicTacToe : system   level: product"
    product.line.2    "  …"
    product.line.3    "  what"
    product.line.4    "    1. Two players take turns placing their mark on a 3 × 3 board.          refined-by: PlayAGame"
    product.line.5    "    2. Three marks in a line wins; a full board with no winner is a draw.   refined-by: Rules"
    product.line.6    "    3. You can play against a friend or against the computer.               refined-by: ChooseOpponent"
    product.line.7    "    4. The computer never loses.                                            refined-by: ComputerPlayer"
    product.line.8    "    5. You can start a new game at any time.                                refined-by: NewGameButton"
    product.line.9    "    6. You can watch the computer play itself, move by move.                refined-by: WatchADemo"
    product.line.10   "  entry     App"
    product.line.11   "  children  App, BoardKit, Engine, UiKit"
    product.mark.1    "4. The computer never loses."
    product.mark.2    "refined-by: ComputerPlayer"
    product.turns     "Nothing is built from this level directly. Each refined-by names the node that will be: for claim 4, ComputerPlayer."
  binds
    stop     JourneyStop with depth product.depth, chip product.chip, reader product.reader, headline product.headline, explanation product.body, lines product.line.1 to product.line.11, label product.label, file product.file, highlight [product.mark.1, product.mark.2], turnsInto product.turns
  uses      JourneyStop, ProductFigure
  children  ProductFigure
```
