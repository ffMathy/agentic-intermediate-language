# Computer player

The specialist node behind "the computer never loses".

```ail
node ComputerPlayer : fn   level: specialist   @ai
  why   Make "the computer never loses" true and provable, while still answering instantly.   <- Engine
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
