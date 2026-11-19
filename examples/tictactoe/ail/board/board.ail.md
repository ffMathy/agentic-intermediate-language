# Board kit

Shared UI. One owner (this library) and two users: the play area and the
watch area.

```ail
node BoardKit : library   level: experience
  why   The board and the status line look and behave the same everywhere they appear.   <- TicTacToe
  children  BoardView, StatusLine
```

```ail
node BoardView : view   level: experience
  why   The board is the whole game; it must be obvious what can be picked.   <- BoardKit
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
  uses  GameState, Text
```

```ail
node StatusLine : view   level: experience
  why   Always tell the players what is going on.   <- BoardKit
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
  uses  GameState, Text
```
