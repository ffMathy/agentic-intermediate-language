# Product figure

```ail
node ProductFigure : view   level: experience
  why   Make visible that every promise at the top has an owner further down.   <- StopProduct
  what
    six promises on the left, each joined to the node that keeps it on the right; promise 4 and its owner stand out, and their joining line moves
    Scenario: the picture
      Given the stop is shown
      Then an image named "Each of the six promises is joined to the node that keeps it; promise 4 goes to ComputerPlayer" is shown
      And it contains the texts "4 never loses" and "ComputerPlayer"
  look
    svg       viewBox 0 0 360 256, width 100%, max-width 360px, height auto, display block
    rows      six rows at y = 8 + 38 × i, for i from 0 to 5
    promise   rect x 8 width 150 height 28 rx 14 at the row's y, fill color.surface, stroke color.border, stroke-width 1; text at x 22, y + 18, font-size 12, fill color.text
    four      promise 4 instead has fill color.thread, stroke color.thread.strong, stroke-width 2, and text weight 700
    owner     rect x 222 width 130 height 28 rx 6 at the row's y, fill color.surface, stroke color.border, stroke-width 1; mono text at x 232, y + 18, font-size 11, fill color.text
    keeper    the ComputerPlayer owner instead has fill color.level.specialist, no stroke, text fill color.on.accent, weight 700
    joins     line from 158, y + 14 to 222, y + 14, stroke color.border, stroke-width 1
    thread    row 4's line instead has stroke color.thread.strong, stroke-width 4, stroke-dasharray "6 4", animation "ail-dash 1s linear infinite"
    caption   text at 180, 250, text-anchor middle, font-size 12, fill color.text.muted
  copy
    product.figure.label  "Each of the six promises is joined to the node that keeps it; promise 4 goes to ComputerPlayer"
    product.figure.p1     "1 take turns"
    product.figure.p2     "2 win or draw"
    product.figure.p3     "3 friend or computer"
    product.figure.p4     "4 never loses"
    product.figure.p5     "5 new game"
    product.figure.p6     "6 watch a demo"
    product.figure.o1     "PlayAGame"
    product.figure.o2     "Rules"
    product.figure.o3     "ChooseOpponent"
    product.figure.o4     "ComputerPlayer"
    product.figure.o5     "NewGameButton"
    product.figure.o6     "WatchADemo"
    product.figure.note   "every promise is refined-by the node that keeps it"
  binds
    svg       role img with aria-label from product.figure.label
```
