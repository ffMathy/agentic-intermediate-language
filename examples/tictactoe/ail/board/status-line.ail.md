# Status line

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
