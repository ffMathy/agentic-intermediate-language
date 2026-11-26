# Rules

```ail
node Rules : fn   level: system
  why   The one definition of a win and a draw.   <- Engine
  what
    LINES: list of list of integer = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
      — rows top to bottom, then columns left to right, then the two diagonals
    evaluate(board: Board) -> Status
      the first line in LINES order whose three cells hold the same mark → won(mark, line)
      otherwise, if every cell is filled → draw
      otherwise → playing
    tie-break: when one move completes two lines, the winning line is the first in LINES order
    examples
      evaluate(boardFrom("XXX/OO_/___")) => ({ kind: "won", mark: "X", line: [0, 1, 2] })
      evaluate(boardFrom("O__/_O_/__O")) => ({ kind: "won", mark: "O", line: [0, 4, 8] })
      evaluate(boardFrom("XOX/XOO/OXX")) => ({ kind: "draw" })
      evaluate(boardFrom("X__/_O_/___")) => ({ kind: "playing" })
      evaluate(boardFrom("XXX/XOO/XOO")) => ({ kind: "won", mark: "X", line: [0, 1, 2] })
      LINES.length => 8
  uses  GameState
```
