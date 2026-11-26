# Stop 4: system level

More nodes in this folder, each in a file of its own: [`SystemFigure`](system-figure.ail.md).

```ail
node StopSystem : view   level: experience
  why   Show the system level: one exact shape for a board, one exact rule for a win, and examples that run as tests.   <- Journey
  what
    the fourth stop, in the system color
    Scenario: the system level
      Given the page is open
      Then the article "stop-4" has the level 3 heading "System level: one exact shape, one exact rule, examples that run."
      And the region named "System-level spec excerpt" shows its fifteen lines, with "evaluate(board: Board) -> Status" highlighted
  look
    stop     JourneyStop with number 4, color color.level.system, figure SystemFigure, browse "#spec/tictactoe/engine/rules.ail.md"
  copy
    system.depth     "depth 3"
    system.chip      "SYSTEM"
    system.reader    "engineers"
    system.headline  "System level: one exact shape, one exact rule, examples that run."
    system.body      "To prove anything about every game, the engine needs one exact board and one definition of a win. Prose gives way to types and examples, and every example line becomes a unit test, word for word. Playing and watching share this engine, so they can never disagree."
    system.label     "System-level spec excerpt"
    system.file      "examples/tictactoe/ail/engine/rules.ail.md"
    system.line.1    "node Rules : fn   level: system"
    system.line.2    "  why   The one definition of a win and a draw.   <- Engine"
    system.line.3    "  what"
    system.line.4    "    LINES: list of list of integer = [[0,1,2], [3,4,5], [6,7,8], …]"
    system.line.5    "    evaluate(board: Board) -> Status"
    system.line.6    "      the first line in LINES order whose three cells hold the same mark → won(mark, line)"
    system.line.7    "      otherwise, if every cell is filled → draw"
    system.line.8    "      otherwise → playing"
    system.line.9    "    tie-break: when one move completes two lines, the winning line is the first in LINES order"
    system.line.10   "    examples"
    system.line.11   "      evaluate(boardFrom("XXX/OO_/___")) => ({ kind: "won", mark: "X", line: [0, 1, 2] })"
    system.line.12   "      …"
    system.line.13   "      evaluate(boardFrom("XOX/XOO/OXX")) => ({ kind: "draw" })"
    system.line.14   "      LINES.length => 8"
    system.line.15   "  uses  GameState"
    system.mark      "evaluate(board: Board) -> Status"
    system.turns     "rules.ts, plus one unit test per example line. ComputerPlayer looks ahead with these same rules."
  binds
    stop     JourneyStop with depth system.depth, chip system.chip, reader system.reader, headline system.headline, explanation system.body, lines system.line.1 to system.line.15, label system.label, file system.file, highlight [system.mark], turnsInto system.turns
  uses      JourneyStop, SystemFigure
  children  SystemFigure
```
