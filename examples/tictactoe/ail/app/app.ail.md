# App

The shell around the two areas, play and watch.

```ail
node App : flow   level: experience
  why   There are two things to do here, play or watch, and switching takes one tap.   <- TicTacToe
  what
    two areas, "Play" and "Watch", picked with one control named "Mode"; "Play" is shown first
    each time an area is picked, it starts fresh
    Scenario: switching to the demo
      Given the play area is shown
      When the viewer picks "Watch"
      Then the demo is shown, nothing can be picked, and the status says "X's turn"
    Scenario: switching back starts a new game
      Given a game in progress
      When the viewer picks "Watch" and then "Play"
      Then every square is empty and the status says "X's turn"
  look
    layout       stack(v, gap: space.4, align: stretch, pad: space.6) [ mode, area ]
    mode         Segmented, fills the width
    width        at most 360px, centered horizontally on the page
    background   color.surface
  copy
    mode.label  "Mode"
    mode.play   "Play"
    mode.watch  "Watch"
  binds
    state   useState("play")
    mode    value = area, onChange(a) = set area
    area    PlayAGame when "play", WatchADemo when "watch"
  uses      PlayAGame, WatchADemo, Stack, Segmented
  children  PlayAGame, WatchADemo
```
