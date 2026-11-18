# Watch area

The computer plays both sides. It reuses the board, the status line, the
rules and the computer player from the play area's shared libraries.

```ail
node WatchADemo : flow   level: experience
  why   Show how a game goes without having to play one.   <- App
  what
    the computer plays both marks, one move every 600 ms, starting with X
    the board can't be picked during the demo
    "Watch again" appears once the demo has ended
    Scenario: the demo starts on its own
      Given the demo has just opened
      Then the board is empty and the status says "X's turn"
    Scenario: the computer plays both sides
      Given the demo has just opened
      When 600 ms pass
      Then one square shows X and the status says "O's turn"
      When another 600 ms pass
      Then one square shows O and the status says "X's turn"
    Scenario: perfect play ends in a draw
      Given the demo has just opened
      When nine moves have been played
      Then the status says "It's a draw"
      And "Watch again" is shown
    Scenario: watch again
      Given the demo has ended
      When the viewer presses "Watch again"
      Then the board is empty, the status says "X's turn", and "Watch again" is gone
  how
    decide one move every 600 ms
      because slow enough to follow each move, while a whole game still takes under six seconds
      rejected the 300 ms the computer takes in play because nobody can follow both sides at that pace
  look
    layout   stack(v, gap: space.4, align: center) [ StatusLine, BoardView, again ]
    width    fills its container
    again    Button.secondary, only once the demo has ended
  copy
    demo.again  "Watch again"
  binds
    state       useReducer(reduce, initial())
    autoplay    while status is playing: after 600 ms dispatch place(choose(board, next)); clear the timer if the game changes first
    StatusLine  status = game.status, next = game.next
    BoardView   board = game.board, status = game.status, locked = true, onPlace(i) = nothing
    again       onPress() = dispatch newGame
  uses  StatusLine, BoardView, GameState, GameReducer, ComputerPlayer
```
