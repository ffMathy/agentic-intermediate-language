# Idea figure

```ail
node IdeaFigure : view   level: experience
  why   Show that the starting point is a person saying something, not a document.   <- StopIdea
  what
    a speech bubble saying "Tic-Tac-Toe." and then "The computer never loses." over a simple person labelled "product owner", with "never loses." highlighted
    Scenario: the picture
      Given the stop is shown
      Then an image named "A product owner says: Tic-Tac-Toe. The computer never loses." is shown
  look
    svg        viewBox 0 0 320 210, width 100%, max-width 320px, height auto, display block
    bubble     rect x 10 y 10 width 300 height 114 rx 16, fill color.surface, stroke color.border, stroke-width 2
    tail       drawn after the bubble, so no border line crosses where it joins: first path "M48 121 L40 148 L74 121 Z" fill color.surface, no stroke (it covers the bubble's border there); then path "M48 124 L40 148 L74 124", fill none, stroke color.border, stroke-width 2
    game       text at 160, 40, text-anchor middle, font-size 16, weight 600, fill color.text.muted
    highlight  rect x 78 y 88 width 164 height 30 rx 4, fill color.thread
    line.1     text at 160, 74, text-anchor middle, font-size 24, weight 700, fill color.text
    line.2     text at 160, 111, text-anchor middle, font-size 24, weight 700, fill color.text
    head       circle cx 40 cy 166 r 10, fill color.text.muted
    body       rect x 22 y 180 width 36 height 24 rx 12, fill color.text.muted
    who        text at 70, 190, font-size 12, fill color.text.muted
  copy
    idea.figure.label  "A product owner says: Tic-Tac-Toe. The computer never loses."
    idea.figure.game   "Tic-Tac-Toe."
    idea.figure.1      "The computer"
    idea.figure.2      "never loses."
    idea.figure.who    "product owner"
  binds
    svg        role img with aria-label from idea.figure.label
```
