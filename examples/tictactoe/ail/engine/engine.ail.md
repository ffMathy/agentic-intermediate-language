# Engine

Shared game logic. The computer player grew big enough to get its own
folder: [`computer-player/`](computer-player/computer-player.ail.md).

More nodes, each in a folder of its own: [`GameState`](game-state/game-state.ail.md), [`GameReducer`](game-reducer/game-reducer.ail.md), [`Rules`](rules/rules.ail.md).

```ail
node Engine : library   level: system
  why   One set of rules for every part of the game, so playing and watching can never disagree.   <- TicTacToe
  children  GameState, Rules, GameReducer, ComputerPlayer
```
