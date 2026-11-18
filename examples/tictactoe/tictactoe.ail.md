# Tic-Tac-Toe

The whole product, specified as an AIL tree. Read from the top: each level is
more detailed than the one above it, and you can stop reading wherever the
detail stops mattering to you.

| Level | Reader | Nodes |
|---|---|---|
| 🟢 product | anyone | `TicTacToe` |
| 🟡 experience | design, QA, product | `PlayAGame`, `BoardView`, `StatusLine`, `NewGameButton`, `ChooseOpponent` |
| 🟠 system | engineers | `GameState`, `GameReducer`, `Rules` |
| 🔴 specialist | game-tree search | `ComputerPlayer` |

```ail
use profile web.react.2026
```

## Glossary

```ail
glossary
  term mark         plain "an X or an O"                                  formal Mark = "X" | "O"
  term turn         plain "whose go it is"                                formal Game.next
  term square       plain "one of the nine places on the board"          formal Board index 0–8, row by row
  term line         plain "three squares in a row, column or diagonal"   formal an entry of Rules.LINES
  term win          plain "three of your marks in a line"                formal status.kind = "won"
  term draw         plain "the board is full and nobody won"             formal status.kind = "draw"
  term "game over"  plain "someone won, or it's a draw"                  formal status.kind ≠ "playing"
  term computer     plain "the built-in opponent, which always plays O"  formal ComputerPlayer
```

Game-specific design tokens, added to the profile's catalog:

```ail
catalog
  tokens
    color.player.x=#2563eb  color.player.o=#dc2626  color.highlight=#fde68a
```

---

## 🟢 Product

```ail
node TicTacToe : system   level: product
  why   A quick, familiar game people can finish in under a minute,
        alone or with a friend on the same device.
  what
    1. Two players take turns placing their mark on a 3 × 3 board.          refined-by: PlayAGame
    2. Three marks in a line wins; a full board with no winner is a draw.   refined-by: Rules
    3. You can play against a friend or against the computer.               refined-by: ChooseOpponent
    4. The computer never loses.                                            refined-by: ComputerPlayer
    5. You can start a new game at any time.                                refined-by: NewGameButton
  entry     PlayAGame
  children  PlayAGame, ChooseOpponent, Rules, ComputerPlayer
```

---

## 🟡 Experience

### PlayAGame

```ail
node PlayAGame : flow   level: experience
  why   Make the game understandable without instructions.   <- TicTacToe
  what
    Scenario: X always starts
      Given a new game
      Then the status says "X's turn"
    Scenario: taking turns
      Given a new game
      When X picks the center square
      Then the center square shows X
      And the status says "O's turn"
    Scenario: a taken square can't be picked
      Given X has the center square
      When O picks the center square
      Then nothing changes and the status still says "O's turn"
    Scenario: winning
      Given X has the top-left and top-middle squares, O has the center and bottom-left squares, and it is X's turn
      When X picks the top-right square
      Then the status says "X wins!"
      And the top row is highlighted
      And no more squares can be picked
    Scenario: draw
      Given a game where the board fills up without a line
      When the last square is picked
      Then the status says "It's a draw"
    Scenario: new game
      Given a finished game
      When the player presses "New game"
      Then every square is empty and the status says "X's turn"
    Scenario: the computer answers
      Given the opponent is the computer
      When X picks a square
      Then shortly after, the computer places an O
      And the status says "X's turn" again
  how
    decide the computer answers after 300 ms
      because an instant answer feels like the player's own move didn't count
      rejected a random pause because it makes behaviour unpredictable and tests slow
    decide squares can't be picked while the computer is thinking
      because otherwise a quick second tap would play the computer's turn
  look
    layout       stack(v, gap: space.4, align: center, pad: space.6) [ ChooseOpponent, StatusLine, BoardView, NewGameButton ]
    width        at most 360px, centered horizontally on the page
    background   color.surface
  binds
    state           useReducer(reduce, initial())
    computer        when opponent is "computer", next is "O" and status is playing:
                    after 300 ms dispatch place(choose(board)); clear the timer if the game changes first
    ChooseOpponent  opponent = game.opponent, onChange(o) = dispatch setOpponent(o)
    StatusLine      status = game.status, next = game.next
    BoardView       board = game.board, status = game.status, locked = computer is thinking, onPlace(i) = dispatch place(i)
    NewGameButton   onPress() = dispatch newGame
  uses      ChooseOpponent, StatusLine, BoardView, NewGameButton, GameState, GameReducer, ComputerPlayer
  children  StatusLine, BoardView, NewGameButton, GameState, GameReducer
```

### BoardView

```ail
node BoardView : view   level: experience
  why   The board is the whole game; it must be obvious what can be picked.   <- PlayAGame
  what
    shows      9 squares in 3 rows of 3; each square is empty, X or O
    picking    pressing an empty square while the game is not over asks to place the current mark there
    otherwise  a taken square, a finished game, or a locked board can't be picked and gives no feedback
    keyboard   squares are reached with Tab in reading order; Enter or Space picks the focused square
    naming     the board is a grid named with board.label; each square is a button named with square.label
               rows and columns count from 1; an empty square's content is the word from square.empty
    Scenario: picking an empty square
      Given an empty board while playing
      When the player presses the square in row 2, column 2
      Then the board asks to place a mark on square 4
    Scenario: a taken square does nothing
      Given the center square holds X
      When the player presses it
      Then nothing is asked
    Scenario: the winning line stands out
      Given X has won with the top row
      Then exactly the three top-row squares are highlighted
      And no square can be picked
  look
    grid          3 × 3, gap space.1, background color.surface, fills the width of its container
    square        square shape (aspect ratio 1), radius.md, background color.surface.raised, no border
    cursor        a pointer only on squares that can be picked
    mark          Text.mark, centered; X in color.player.x, O in color.player.o
    winning line  its three squares get background color.highlight instead
  copy
    board.label   "Board"
    square.label  "Row {row}, column {column}, {content}"
    square.empty  "empty"
  binds
    props    board: Board, status: Status, locked: boolean, onPlace(index: number)
    square   a native button, disabled when it can't be picked
  free  [ internal component split ]
  uses  GameState
```

### StatusLine

```ail
node StatusLine : view   level: experience
  why   Always tell the players what is going on.   <- PlayAGame
  what
    shows exactly one message: whose turn it is, who won, or that it's a draw
    the mark in the message appears in that player's color
    changes are announced to screen readers
    Scenario: whose turn
      Given it is O's turn
      Then the status reads "O's turn"
    Scenario: a win
      Given X has won
      Then the status reads "X wins!"
    Scenario: a draw
      Given the game is a draw
      Then the status reads "It's a draw"
  look
    text     Text.status, centered, announced politely
    player   the {player} part in color.player.x or color.player.o
  copy
    status.turn  "{player}'s turn"
    status.win   "{player} wins!"
    status.draw  "It's a draw"
  binds
    props    status: Status, next: Mark
  uses  GameState
```

### NewGameButton

```ail
node NewGameButton : view   level: experience
  why   Starting over must always be one press away.   <- PlayAGame
  what
    Scenario: pressing it
      When the player presses "New game"
      Then a new game is asked for, once
  look
    button   Button.secondary, width auto
  copy
    newgame.label  "New game"
  binds
    props    onPress()
```

### ChooseOpponent

```ail
node ChooseOpponent : view   level: experience
  why   Let someone playing alone still have fun.   <- TicTacToe
  what
    two options, "Friend" and "Computer", named together as "Opponent"
    you are always X; the computer is always O
    Scenario: switching to the computer
      Given the opponent is a friend
      When the player chooses "Computer"
      Then the computer is asked for as the new opponent
  look
    control  Segmented, fills the width
  copy
    opponent.label     "Opponent"
    opponent.friend    "Friend"
    opponent.computer  "Computer"
  binds
    props   opponent: Opponent, onChange(opponent: Opponent)
  uses  GameState
```

---

## 🟠 System

### GameState

```ail
node GameState : data   level: system
  why   One shape for a game, so every part agrees on it.   <- PlayAGame
  what
    type Mark     = "X" | "O"
    type Cell     = Mark | null
    type Board    = Cell[]          — always 9 cells, row by row: index = row × 3 + column
    type Status   = { kind: "playing" } | { kind: "won", mark: Mark, line: number[] } | { kind: "draw" }
    type Opponent = "friend" | "computer"
    type Game     = { board: Board, next: Mark, status: Status, opponent: Opponent }
    type Action   = { type: "place", index: number } | { type: "newGame" } | { type: "setOpponent", opponent: Opponent }
    initial(opponent: Opponent = "friend") -> Game     — empty board, X to move, playing
    other(mark: Mark) -> Mark                          — the opposite mark
    boardFrom(text: string) -> Board                   — "X", "O" or "_" per cell, row by row; "/" and spaces are ignored
    examples
      initial() => ({ board: [null, null, null, null, null, null, null, null, null], next: "X", status: { kind: "playing" }, opponent: "friend" })
      initial("computer").opponent => "computer"
      other("X") => "O"
      other("O") => "X"
      boardFrom("X_O/___/__X") => ["X", null, "O", null, null, null, null, null, "X"]
```

### GameReducer

```ail
node GameReducer : fn   level: system
  why   Keep every rule of play in one place that can be tested without a screen.   <- PlayAGame
  what
    reduce(game: Game, action: Action) -> Game        — never mutates its input
      place(index)
        if status is playing and board[index] is empty:
          board[index] becomes next; status becomes evaluate(board);
          next becomes other(next) only if the status is still playing
        otherwise: return the same game object
      newGame          → initial(game.opponent)
      setOpponent(o)   → initial(o)
    play(indices: number[], opponent: Opponent = "friend") -> Game
      — reduce place(i) for each index in order, starting from initial(opponent)
    examples
      play([4]).board[4] => "X"
      play([4]).next => "O"
      play([0, 3, 1, 4, 2]).status => ({ kind: "won", mark: "X", line: [0, 1, 2] })
      play([0, 3, 1, 4, 2]).next => "X"
      (g => reduce(g, { type: "place", index: 4 }) === g)(play([4])) => true
      (g => reduce(g, { type: "place", index: 8 }) === g)(play([0, 3, 1, 4, 2])) => true
      play([0, 1, 2, 4, 3, 5, 7, 6, 8]).status => ({ kind: "draw" })
      reduce(play([4], "computer"), { type: "newGame" }) => initial("computer")
      reduce(play([4]), { type: "setOpponent", opponent: "computer" }) => initial("computer")
  free  [ helper names ]
  uses  GameState, Rules
```

### Rules

```ail
node Rules : fn   level: system
  why   The one definition of a win and a draw.   <- TicTacToe
  what
    LINES: number[][] = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
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

---

## 🔴 Specialist

### ComputerPlayer

```ail
node ComputerPlayer : fn   level: specialist   @ai
  why   Make "the computer never loses" true and provable, while still answering instantly.   <- TicTacToe
  what
    choose(board: Board, me: Mark = "O") -> number    — precondition: the game on board is still playing
    deterministic: the same board always gives the same index
    scoring, from me's point of view, where d counts the moves from board to the end of the game, this one included:
      me wins → 10 − d;  me loses → d − 10;  draw → 0
    tie-break: among equally scored moves, the lowest index
    invariant: whatever the other player does, no game against choose ends in a win for the other player
    examples
      choose(boardFrom("XX_/O__/___")) => 2
      choose(boardFrom("OO_/XX_/X__")) => 2
      choose(boardFrom("X__/___/___")) => 4
      choose(boardFrom("___/___/___"), "X") => 0
    probes
      choose(boardFrom("_X_/___/___"))
      choose(boardFrom("____X____"))
  how
    decide full minimax over the remaining game tree, memoized by board
      because there are at most 5,478 legal positions; exact search takes well under a millisecond and makes "never loses" provable
      rejected hand-written heuristics (centre, corners, block, fork) because they are hard to prove correct and easy to get subtly wrong
      rejected alpha-beta pruning because it is unnecessary at this size and adds code to review
  verify
    never loses: from the empty board, play every possible sequence of X moves against choose as O
                 and assert that no game ends in a win for X
  free  [ memo structure, recursion style ]
  uses  GameState, Rules
```
