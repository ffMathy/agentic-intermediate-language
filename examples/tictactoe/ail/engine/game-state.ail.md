# Game state

```ail
node GameState : data   level: system
  why   One shape for a game, so every part agrees on it.   <- Engine
  what
    type Mark     = "X" | "O"
    type Cell     = Mark | nothing
    type Board    = list of Cell    — always 9 cells, row by row: index = row × 3 + column
    type Status   = { kind: "playing" } | { kind: "won", mark: Mark, line: list of integer } | { kind: "draw" }
    type Opponent = "friend" | "computer"
    type Game     = { board: Board, next: Mark, status: Status, opponent: Opponent }
    type Action   = { type: "place", index: integer } | { type: "newGame" } | { type: "setOpponent", opponent: Opponent }
    initial(opponent: Opponent = "friend") -> Game     — empty board, X to move, playing
    other(mark: Mark) -> Mark                          — the opposite mark
    boardFrom(text: text) -> Board                     — "X", "O" or "_" per cell, row by row; "/" and spaces are ignored
    examples
      initial() => { board: [nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing], next: "X", status: { kind: "playing" }, opponent: "friend" }
      initial("computer").opponent => "computer"
      other("X") => "O"
      other("O") => "X"
      boardFrom("X_O/___/__X") => ["X", nothing, "O", nothing, nothing, nothing, nothing, nothing, "X"]
```
