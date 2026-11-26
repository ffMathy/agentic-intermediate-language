# Experience figure

```ail
node ExperienceFigure : view   level: experience
  why   Show the scenario as three frames a designer would sketch.   <- StopExperience
  what
    three small boards: empty, then X in the center, then an O answering in the top-left corner, with "300 ms" between the last two and the status line under them
    Scenario: the picture
      Given the stop is shown
      Then an image named "Three frames: an empty board, X in the center, then O answers after 300 ms" is shown
      And it contains the texts "Given:", "vs computer", "When:", "X picks", "Then:", "O answers" and "300 ms"
  look
    svg       viewBox 0 0 360 176, width 100%, max-width 360px, height auto, display block
    frames    MiniBoard at x 6, 141 and 276, y 10, cell 26, with marks "_________", "____X____" and "O___X____"
    arrows    lines 90,49 to 133,49 and 225,49 to 268,49, stroke color.text.muted, stroke-width 2; heads path "M127 44 L135 49 L127 54 Z" and "M262 44 L270 49 L262 54 Z", fill color.text.muted
    watch     circle cx 247 cy 26 r 8, fill none, stroke color.text.muted, stroke-width 1.5; hand line 247,26 to 247,21; button line 247,16 to 247,14, both stroke color.text.muted, stroke-width 1.5
    delay     mono text at 247, 72, text-anchor middle, font-size 12, fill color.text
    captions  two text lines under each board, at x 45, 180 and 315, text-anchor middle, font-size 14, fill color.text.muted: the first line (experience.figure.1a, 2a and 3a) at y 106 in weight 700, the second line (experience.figure.1b, 2b and 3b) at y 122
    status    rect x 120 y 132 width 120 height 32 rx 16, fill color.surface, stroke color.border; text at 180, 153, text-anchor middle, font-size 16, weight 600, fill color.text, its X in a tspan with fill color.player.x
  copy
    experience.figure.label  "Three frames: an empty board, X in the center, then O answers after 300 ms"
    experience.figure.1a     "Given:"
    experience.figure.1b     "vs computer"
    experience.figure.2a     "When:"
    experience.figure.2b     "X picks"
    experience.figure.3a     "Then:"
    experience.figure.3b     "O answers"
    experience.figure.delay  "300 ms"
    experience.figure.mark   "X"
    experience.figure.turn   "'s turn"
  binds
    svg       role img with aria-label from experience.figure.label
  uses  MiniBoard
```
