# Stop 2: product level

```ail
node StopProduct : view   level: experience
  why   Show the product level: the sentence becomes one of the promises at the root, and each promise names who keeps it.   <- Journey
  what
    the second stop, in the product color
    Scenario: the product level
      Given the page is open
      Then the article "stop-2" has the level 3 heading "Product level: the sentence becomes a promise with an owner."
      And the region named "Product-level spec excerpt" shows its eleven lines, with claim 4 and "refined-by: ComputerPlayer" highlighted
  look
    stop     JourneyStop with number 2, color color.level.product, figure ProductFigure
  copy
    product.depth     "depth 1"
    product.chip      "PRODUCT"
    product.reader    "anyone: stakeholders, customers, the whole team"
    product.headline  "Product level: the sentence becomes a promise with an owner."
    product.body      "In the root node, the sentence sits beside five other promises. Each one must name a deeper node that makes it true, and a check rejects jargon and code at this level, so anyone can review it."
    product.label     "Product-level spec excerpt"
    product.file      "examples/tictactoe/tictactoe.ail.md"
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

```ail
node ProductFigure : view   level: experience
  why   Make visible that every promise at the top has an owner further down.   <- StopProduct
  what
    six promises on the left, each joined to the node that keeps it on the right; promise 4 and its owner stand out, and their joining line moves
    Scenario: the picture
      Given the stop is shown
      Then an image named "Each of the six promises is joined to the node that keeps it; promise 4 goes to ComputerPlayer" is shown
      And it contains the texts "4 never loses" and "ComputerPlayer"
  look
    svg       viewBox 0 0 360 256, width 100%, max-width 360px, height auto, display block
    rows      six rows at y = 8 + 38 × i, for i from 0 to 5
    promise   rect x 8 width 150 height 28 rx 14 at the row's y, fill color.surface, stroke color.border, stroke-width 1; text at x 22, y + 18, font-size 12, fill color.text
    four      promise 4 instead has fill color.thread, stroke color.thread.strong, stroke-width 2, and text weight 700
    owner     rect x 222 width 130 height 28 rx 6 at the row's y, fill color.surface, stroke color.border, stroke-width 1; mono text at x 232, y + 18, font-size 11, fill color.text
    keeper    the ComputerPlayer owner instead has fill color.level.specialist, no stroke, text fill color.on.accent, weight 700
    joins     line from 158, y + 14 to 222, y + 14, stroke color.border, stroke-width 1
    thread    row 4's line instead has stroke color.thread.strong, stroke-width 4, stroke-dasharray "6 4", animation "ail-dash 1s linear infinite"
    caption   text at 180, 250, text-anchor middle, font-size 12, fill color.text.muted
  copy
    product.figure.label  "Each of the six promises is joined to the node that keeps it; promise 4 goes to ComputerPlayer"
    product.figure.p1     "1 take turns"
    product.figure.p2     "2 win or draw"
    product.figure.p3     "3 friend or computer"
    product.figure.p4     "4 never loses"
    product.figure.p5     "5 new game"
    product.figure.p6     "6 watch a demo"
    product.figure.o1     "PlayAGame"
    product.figure.o2     "Rules"
    product.figure.o3     "ChooseOpponent"
    product.figure.o4     "ComputerPlayer"
    product.figure.o5     "NewGameButton"
    product.figure.o6     "WatchADemo"
    product.figure.note   "every promise is refined-by the node that keeps it"
  binds
    svg       role img with aria-label from product.figure.label
```
