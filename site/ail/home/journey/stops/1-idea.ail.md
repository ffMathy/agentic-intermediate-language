# Stop 1: the idea

More nodes in this folder, each in a file of its own: [`IdeaFigure`](idea-figure.ail.md).

```ail
node StopIdea : view   level: experience
  why   The journey starts where every project starts: someone saying what they want, in words anyone could say.   <- Journey
  what
    the first stop, in the accent color, before any level of the spec
    Scenario: the idea
      Given the page is open
      Then the article "stop-1" has the level 3 heading "It starts with what the product owner wants."
      And the region named "What the product owner asked for" shows its eight lines: the game, then all six requirements, with "4. The computer never loses." highlighted
  look
    stop     JourneyStop with number 1, color color.accent, figure IdeaFigure, browse "#spec/tictactoe/tictactoe.ail.md"
  copy
    idea.depth      "idea"
    idea.chip       "IDEA"
    idea.reader     "a product owner, in their own words"
    idea.headline   "It starts with what the product owner wants."
    idea.body       "Every AIL project starts with someone saying what they want, in plain words. Here a product owner asks for Tic-Tac-Toe, with six requirements. We follow one of them, “The computer never loses.”, all the way down to the code and the game. Nothing here is technical yet, and it shouldn't be."
    idea.label      "What the product owner asked for"
    idea.file       "examples/tictactoe/ail/tictactoe.ail.md"
    idea.line.1     "Tic-Tac-Toe: a quick, familiar game people can finish in under a minute,"
    idea.line.2     "alone or with a friend on the same device."
    idea.line.3     "1. Two players take turns placing their mark on a 3 × 3 board."
    idea.line.4     "2. Three marks in a line wins; a full board with no winner is a draw."
    idea.line.5     "3. You can play against a friend or against the computer."
    idea.line.6     "4. The computer never loses."
    idea.line.7     "5. You can start a new game at any time."
    idea.line.8     "6. You can watch the computer play itself, move by move."
    idea.highlight  "4. The computer never loses."
    idea.turns      "These words go into the spec unchanged, at the top of the tree. Next, each requirement gets a node that will make it true."
  binds
    stop     JourneyStop with depth idea.depth, chip idea.chip, reader idea.reader, headline idea.headline, explanation idea.body, lines idea.line.1 to idea.line.8, label idea.label, file idea.file, highlight [idea.highlight], turnsInto idea.turns
  uses      JourneyStop, IdeaFigure
  children  IdeaFigure
```
