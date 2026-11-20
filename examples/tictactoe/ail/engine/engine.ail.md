# Engine

Shared game logic. The computer player grew big enough to get its own
folder: [`computer-player/`](computer-player/computer-player.ail.md).

```ail
node Engine : library   level: system
  why   One set of rules for every part of the game, so playing and watching can never disagree.   <- TicTacToe
  children  GameState, Rules, GameReducer, ComputerPlayer
```

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

```ail
node GameReducer : fn   level: system
  why   Keep every rule of play in one place that can be tested without a screen.   <- Engine
  what
    reduce(game: Game, action: Action) -> Game        — never mutates its input
      place(index)
        if status is playing and board[index] is empty:
          board[index] becomes next; status becomes evaluate(board);
          next becomes other(next) only if the status is still playing
        otherwise: return the same game object
      newGame          → initial(game.opponent)
      setOpponent(o)   → initial(o)
    play(indices: list of integer, opponent: Opponent = "friend") -> Game
      — reduce place(i) for each index in order, starting from initial(opponent)
    examples
      play([4]).board[4] => "X"
      play([4]).next => "O"
      play([0, 3, 1, 4, 2]).status => ({ kind: "won", mark: "X", line: [0, 1, 2] })
      play([0, 3, 1, 4, 2]).next => "X"
      reduce(g, { type: "place", index: 4 }) is g => true   where g = play([4])
      reduce(g, { type: "place", index: 8 }) is g => true   where g = play([0, 3, 1, 4, 2])
      play([0, 1, 2, 4, 3, 5, 7, 6, 8]).status => ({ kind: "draw" })
      reduce(play([4], "computer"), { type: "newGame" }) => initial("computer")
      reduce(play([4]), { type: "setOpponent", opponent: "computer" }) => initial("computer")
  free  [ helper names ]
  uses  GameState, Rules
```

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
