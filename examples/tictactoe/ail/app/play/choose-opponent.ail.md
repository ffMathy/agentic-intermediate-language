# Choose opponent

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
    control  Segmented, which fills the width by itself (no wrapper)
  copy
    opponent.label     "Opponent"
    opponent.friend    "Friend"
    opponent.computer  "Computer"
  binds
    props   opponent: Opponent, onChange(opponent: Opponent)
  uses  GameState, Segmented
```
