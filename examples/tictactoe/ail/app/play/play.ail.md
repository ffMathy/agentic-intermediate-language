# Play area

Two people, or one person and the computer, play a game.

More nodes in this folder, each in a file of its own: [`NewGameButton`](new-game-button.ail.md), [`ChooseOpponent`](choose-opponent.ail.md).

```ail
node PlayAGame : flow   level: experience
  why   Make the game understandable without instructions.   <- App
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
    layout       stack(v, gap: space.4, align: center) [ ChooseOpponent, StatusLine, BoardView, NewGameButton ]
    width        fills its container
  binds
    state           game: Game, starting at initial(); "dispatch a" sets it to reduce(game, a)
    computer        when opponent is "computer", next is "O" and status is playing:
                    after 300 ms dispatch place(choose(board)); clear the timer if the game changes first
    ChooseOpponent  opponent = game.opponent, onChange(o) = dispatch setOpponent(o)
    StatusLine      status = game.status, next = game.next
    BoardView       board = game.board, status = game.status, locked = computer is thinking, onPlace(i) = dispatch place(i)
    NewGameButton   onPress() = dispatch newGame
  uses      ChooseOpponent, StatusLine, BoardView, NewGameButton, GameState, GameReducer, ComputerPlayer, Stack
  children  NewGameButton, ChooseOpponent
```
