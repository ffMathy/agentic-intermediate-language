# Tic-Tac-Toe

The whole product, specified as an AIL tree. Read from the top: each level is
more detailed than the one above it, and you can stop reading wherever the
detail stops mattering to you.

The folders mirror the tree. Shared parts sit in `library` nodes with one
owner, and each area lists them under `uses`:

```
tictactoe.ail.md                         🟢 TicTacToe (this file)
app/app.ail.md                           🟡 App: switches between the two areas
app/play/play.ail.md                     🟡 PlayAGame, NewGameButton, ChooseOpponent
app/demo/demo.ail.md                     🟡 WatchADemo
board/board.ail.md                       🟡 BoardKit (library): BoardView, StatusLine
engine/engine.ail.md                     🟠 Engine (library): GameState, Rules, GameReducer
engine/computer-player/computer-player.ail.md   🔴 ComputerPlayer
```

Both areas, play and watch, reuse the same board, status line, rules and
computer player. Generated code mirrors these folders under `src/gen/`.

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
    6. You can watch the computer play itself, move by move.                refined-by: WatchADemo
  entry     App
  children  App, BoardKit, Engine
```
