# System figure

```ail
node SystemFigure : view   level: experience
  why   Show that a board is nine numbered squares and that one rule turns any board into exactly one of three answers.   <- StopSystem
  what
    a board with its top row of X marks highlighted and its empty squares numbered, an arrow into the rule, and three possible answers, the first of them lit
    Scenario: the picture
      Given the stop is shown
      Then an image named "A board goes into the one rule and comes out as won, draw or playing" is shown
      And it contains the texts "won · X", "draw" and "playing"
  look
    svg       viewBox 0 0 360 164, width 100%, max-width 360px, height auto, display block
    board     MiniBoard at x 8, y 20, cell 28, marks "XXXOO____", highlight 0, 1 and 2, numbers shown
    shape     text at 8, 124, font-size 11, fill color.text.muted
    into      line 96,62 to 132,62, stroke color.text.muted, stroke-width 2; head path "M126 57 L134 62 L126 67 Z", fill color.text.muted
    rule      rect x 136 y 44 width 96 height 36 rx 8, fill color.level.system; mono text at 184, 67, text-anchor middle, font-size 13, fill color.on.accent
    fan       lines from 232,62 to 268,27, to 268,62 and to 268,97, stroke color.text.muted, stroke-width 1.5
    answers   rects x 268 width 84 height 26 rx 13 at y 14, 49 and 84; mono texts at x 310, y + 17, text-anchor middle, font-size 13, fill color.text
    won       the first answer has fill color.thread and stroke color.thread.strong; the others fill color.surface and stroke color.border
    bracket   path "M136 120 V128 H232 V120", stroke color.text.muted, stroke-width 1.5, fill none; text at 184, 152, text-anchor middle, font-size 13, fill color.text.muted
  copy
    system.figure.label    "A board goes into the one rule and comes out as won, draw or playing"
    system.figure.shape    "9 squares, row by row"
    system.figure.rule     "evaluate"
    system.figure.won      "won · X"
    system.figure.draw     "draw"
    system.figure.playing  "playing"
    system.figure.shared   "Engine: shared by play and watch"
  binds
    svg       role img with aria-label from system.figure.label
  uses  MiniBoard
```
