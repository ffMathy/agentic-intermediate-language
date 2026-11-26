# Board kit

Shared UI. One owner (this library) and two users: the play area and the
watch area.

More nodes in this folder, each in a file of its own: [`BoardView`](board-view.ail.md), [`StatusLine`](status-line.ail.md).

```ail
node BoardKit : library   level: experience
  why   The board and the status line look and behave the same everywhere they appear.   <- TicTacToe
  children  BoardView, StatusLine
```
