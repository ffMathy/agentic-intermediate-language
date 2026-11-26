# Stop 5: specialist level

More nodes, each in a folder of its own: [`SpecialistFigure`](specialist-figure/specialist-figure.ail.md).

```ail
node StopSpecialist : view   level: experience
  why   Show the specialist level, where the promise is finally made true: an algorithm, an invariant and a stated way to prove it.   <- Journey
  what
    the fifth stop, in the specialist color
    Scenario: the specialist level
      Given the page is open
      Then the article "stop-5" has the level 3 heading "Specialist level: the promise becomes an algorithm and a proof."
      And the region named "Specialist-level spec excerpt" shows its fifteen lines, with "never loses" and the invariant highlighted
  look
    stop     JourneyStop with number 5, color color.level.specialist, figure SpecialistFigure, browse "#spec/tictactoe/engine/computer-player/computer-player.ail.md"
  copy
    specialist.depth     "depth 4"
    specialist.chip      "SPECIALIST"
    specialist.reader    "experts: here, someone who knows game search"
    specialist.headline  "Specialist level: the promise becomes an algorithm and a proof."
    specialist.body      "This is where “never loses” is made true. The node fixes the algorithm, the exact scoring, the tie-break and an invariant, and says how the promise will be checked. Rejected alternatives stay in the spec, so nobody argues them again."
    specialist.label     "Specialist-level spec excerpt"
    specialist.file      "examples/tictactoe/ail/engine/computer-player/computer-player.ail.md"
    specialist.line.1    "node ComputerPlayer : fn   level: specialist   @ai"
    specialist.line.2    "  why   Make "the computer never loses" true and provable, while still answering instantly.   <- Engine"
    specialist.line.3    "  what"
    specialist.line.4    "    choose(board: Board, me: Mark = "O") -> number    — precondition: the game on board is still playing"
    specialist.line.5    "    scoring, from me's point of view, where d counts the moves from board to the end of the game, this one included:"
    specialist.line.6    "      me wins → 10 − d;  me loses → d − 10;  draw → 0"
    specialist.line.7    "    tie-break: among equally scored moves, the lowest index"
    specialist.line.8    "    invariant: whatever the other player does, no game against choose ends in a win for the other player"
    specialist.line.9    "  how"
    specialist.line.10   "    decide full minimax over the remaining game tree, memoized by board"
    specialist.line.11   "      because there are at most 5,478 legal positions; exact search takes well under a millisecond and makes "never loses" provable"
    specialist.line.12   "      rejected hand-written heuristics (centre, corners, block, fork) because they are hard to prove correct and easy to get subtly wrong"
    specialist.line.13   "  verify"
    specialist.line.14   "    never loses: from the empty board, play every possible sequence of X moves against choose as O"
    specialist.line.15   "                 and assert that no game ends in a win for X"
    specialist.mark.1    "never loses"
    specialist.mark.2    "no game against choose ends in a win for the other player"
    specialist.turns     "A minimax search in TypeScript, and a check that plays every possible game against it."
  binds
    stop     JourneyStop with depth specialist.depth, chip specialist.chip, reader specialist.reader, headline specialist.headline, explanation specialist.body, lines specialist.line.1 to specialist.line.15, label specialist.label, file specialist.file, highlight [specialist.mark.1, specialist.mark.2], turnsInto specialist.turns
  uses      JourneyStop, SpecialistFigure
  children  SpecialistFigure
```
