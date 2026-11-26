# Specialist figure

```ail
node SpecialistFigure : view   level: experience
  why   Show what "looking at every game" means: a tree of possible games in which X never wins.   <- StopSpecialist
  what
    a board at the top branching into three boards, each branching into three outcomes; every outcome is an O win or a draw, and the legend says X wins never
    Scenario: the picture
      Given the stop is shown
      Then an image named "A tree of possible games: every ending is an O win or a draw, never an X win" is shown
      And it contains the texts "O wins", "draw" and "X wins: never"
  look
    svg       viewBox 0 0 360 210, width 100%, max-width 360px, height auto, display block
    edges     drawn first, stroke color.level.specialist, stroke-width 1, opacity 0.5: from 130,44 to 46,80, 130,80 and 214,80; from each child's bottom center (46, 130 or 214; y 104) to its three leaves at x − 24, x and x + 24, y 145
    root      MiniBoard at x 112, y 8, cell 12, marks "X___O____"
    children  MiniBoard at x 34, 118 and 202, y 80, cell 8, with marks "X_X_O____", "XX__O____" and "X___O___X"
    leaves    circles r 5 at y 150 and x 22, 46, 70, 106, 130, 154, 190, 214, 238; fill color.pass for the 2nd, 4th and 8th, color.code.muted for the others
    legend    circles r 5 at cx 270, cy 40, 64 and 88, filled color.pass, color.code.muted and color.player.x; the third crossed by line 262,88 to 278,88, stroke color.text, stroke-width 1.5; texts at x 282, y 44, 68 and 92, font-size 12, fill color.text
    facts     mono text at 180, 196, text-anchor middle, font-size 12, fill color.text.muted
  copy
    specialist.figure.label  "A tree of possible games: every ending is an O win or a draw, never an X win"
    specialist.figure.owins  "O wins"
    specialist.figure.draw   "draw"
    specialist.figure.xwins  "X wins: never"
    specialist.figure.facts  "≤ 5,478 positions · memoized · every game checked"
  binds
    svg       role img with aria-label from specialist.figure.label
  uses  MiniBoard
```
