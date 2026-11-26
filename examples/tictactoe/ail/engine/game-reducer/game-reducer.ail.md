# Game reducer

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
