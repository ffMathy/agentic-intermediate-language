# Mini board

A small Tic-Tac-Toe board drawn inside the page's figures, in the same colors
as the demo.

```ail
node MiniBoard : view   level: experience
  why   Several figures show a game position, and it must look like the real board every time.   <- Parts
  what
    draws a 3 by 3 board inside a larger picture, at the position and size it is given
    shows each square's mark from the given marks text, read row by row: X, O or an empty square
    highlighted squares stand out in the thread color
    when asked, each empty square shows its number from 0 to 8
    Scenario: marks
      Given the marks "X___O____"
      Then exactly two marks are drawn: an X and an O
    Scenario: numbers in empty squares
      Given the marks "XXXOO____" and numbers shown
      Then the numbers 5, 6, 7 and 8 are drawn, and no other numbers
  look
    group    an SVG g element; it is drawn inside a parent svg, never on its own
    squares  9 rect elements, cell by cell: x = x + column × cell, y = y + row × cell, width and height cell; fill color.surface, stroke color.border, stroke-width 1.5
    lit      a highlighted square has fill color.thread instead
    mark     a text element at the square's center, text-anchor middle, dominant-baseline central, font.sans weight 800, font-size cell × 0.62; X in color.player.x, O in color.player.o
    number   a text element at the square's center, text-anchor middle, dominant-baseline central, font.mono, font-size cell × 0.36, fill color.text.muted
  binds
    props    x: number, y: number, cell: number, marks: string, highlight?: number[], numbers?: boolean
    marks    9 characters, one per square, row by row: "X", "O" or "_" for empty
```
