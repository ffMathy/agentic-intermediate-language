# Stop 1: the idea

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

```ail
node IdeaFigure : view   level: experience
  why   Show that the starting point is a person saying something, not a document.   <- StopIdea
  what
    a speech bubble saying "Tic-Tac-Toe." and then "The computer never loses." over a simple person labelled "product owner", with "never loses." highlighted
    Scenario: the picture
      Given the stop is shown
      Then an image named "A product owner says: Tic-Tac-Toe. The computer never loses." is shown
  look
    svg        viewBox 0 0 320 210, width 100%, max-width 320px, height auto, display block
    tail       path "M48 122 L40 148 L74 122" fill color.surface, stroke color.border, stroke-width 2, drawn first
    bubble     rect x 10 y 10 width 300 height 114 rx 16, fill color.surface, stroke color.border, stroke-width 2
    game       text at 160, 40, text-anchor middle, font-size 16, weight 600, fill color.text.muted
    highlight  rect x 78 y 88 width 164 height 30 rx 4, fill color.thread
    line.1     text at 160, 74, text-anchor middle, font-size 24, weight 700, fill color.text
    line.2     text at 160, 111, text-anchor middle, font-size 24, weight 700, fill color.text
    head       circle cx 40 cy 166 r 10, fill color.text.muted
    body       rect x 22 y 180 width 36 height 24 rx 12, fill color.text.muted
    who        text at 70, 190, font-size 12, fill color.text.muted
  copy
    idea.figure.label  "A product owner says: Tic-Tac-Toe. The computer never loses."
    idea.figure.game   "Tic-Tac-Toe."
    idea.figure.1      "The computer"
    idea.figure.2      "never loses."
    idea.figure.who    "product owner"
  binds
    svg        role img with aria-label from idea.figure.label
```
