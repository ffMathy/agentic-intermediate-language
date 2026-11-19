# Play area

Two people, or one person and the computer, play a game.

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
    state           useReducer(reduce, initial())
    computer        when opponent is "computer", next is "O" and status is playing:
                    after 300 ms dispatch place(choose(board)); clear the timer if the game changes first
    ChooseOpponent  opponent = game.opponent, onChange(o) = dispatch setOpponent(o)
    StatusLine      status = game.status, next = game.next
    BoardView       board = game.board, status = game.status, locked = computer is thinking, onPlace(i) = dispatch place(i)
    NewGameButton   onPress() = dispatch newGame
  uses      ChooseOpponent, StatusLine, BoardView, NewGameButton, GameState, GameReducer, ComputerPlayer, Stack
  children  NewGameButton, ChooseOpponent
```

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
  uses  Button
```

```ail
node ChooseOpponent : view   level: experience
  why   Let someone playing alone still have fun.   <- PlayAGame
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
  uses  GameState, Segmented
```
