# New game button

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
