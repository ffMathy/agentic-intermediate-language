# Tree figure

```ail
node TreeFigure : view   level: experience
  why   Show the tree itself: every node of the Tic-Tac-Toe spec, and the path the page follows down to the computer player.   <- TreeSection
  what
    every node of the spec as a box colored by its level: the root on top, its four children in a row under it, and under each of those its own children stacked in a column; the two children of PlayAGame sit one step further in, under PlayAGame
    lines join each node to its parent; the path from the root through Engine to ComputerPlayer is drawn as the yellow thread
    below 600px viewport width the same tree is drawn as an indented outline, one node per row, so every name stays readable on a phone
    Scenario: the picture
      Given the section is shown
      Then an image named "The Tic-Tac-Toe spec as a tree: every node, with the path from TicTacToe through Engine down to ComputerPlayer highlighted" is shown
      And it contains the texts "TicTacToe", "App", "PlayAGame", "NewGameButton", "ChooseOpponent", "WatchADemo", "BoardKit", "BoardView", "StatusLine", "Engine", "GameState", "Rules", "GameReducer", "ComputerPlayer", "UiKit", "Stack", "Text", "Button" and "Segmented"
  look
    svg       class "ail-wide" (shown only at 600px viewport width or more); viewBox 0 0 960 360, width 100%, height auto, display block
    lines     drawn first, stroke color.border, stroke-width 2, fill none
    thread    drawn over the lines, stroke color.thread, stroke-width 5, stroke-linecap round, fill none
    box       a rect with rx 10; its name centered in it (text-anchor middle, at the box's center x and its y + 24 for a 38 high box, + 28 for a 44 high one), weight 700, fill color.on.accent
    root      box x 380 y 10 width 200 height 44, fill color.level.product, font-size 16: TicTacToe
    columns   four boxes y 100 width 220 height 44, font-size 15: x 10 App, x 250 BoardKit and x 730 UiKit, fill color.level.experience; x 490 Engine, fill color.level.system
    to.columns  lines from 480,54 to 120,100; to 360,100; to 600,100; and to 840,100 (that last one to Engine is the thread instead: 480,54 to 600,100)
    rows      children are boxes of height 38, font-size 13, at y 166, 214, 262, 310 for the first to fourth child in a column
    spine     each column has a line from its spine x, 144 down to the center y (box y + 19) of its last child, and from the spine x to each child's left edge at that child's center y; the spine x is the column's x + 16, and children start at the column's x + 32 with width 188
    app       under App: PlayAGame at y 166, WatchADemo at y 310, fill color.level.experience; App's spine reaches PlayAGame and WatchADemo only
    play      under PlayAGame, one step in: NewGameButton at y 214 and ChooseOpponent at y 262, at x 74 width 156, fill color.level.experience; their own spine at x 58, from 204 down to 281, with lines from 58 to 74 at each child's center y
    board     under BoardKit: BoardView at y 166 and StatusLine at y 214, fill color.level.experience
    engine    under Engine: GameState, Rules and GameReducer at y 166, 214 and 262, fill color.level.system; ComputerPlayer at y 310, fill color.level.specialist; Engine's spine and the line to ComputerPlayer are the thread instead
    ui        under UiKit: boxes named "Stack", "Text", "Button" and "Segmented" at y 166, 214, 262 and 310, fill color.level.experience
    outline   a second svg with class "ail-narrow" (shown only below 600px viewport width): viewBox 0 0 300 534, width 100%, max-width 320px, height auto, margin 0 auto. It has 19 rows in this order: TicTacToe, App, PlayAGame, NewGameButton, ChooseOpponent, WatchADemo, BoardKit, BoardView, StatusLine, Engine, GameState, Rules, GameReducer, ComputerPlayer, UiKit, "Stack", "Text", "Button", "Segmented". Row i (counting from 0) is a rect at y 4 + 28 × i, height 22, width 180, rx 6, at x 4 for TicTacToe, x 28 for App, BoardKit, Engine and UiKit, x 76 for NewGameButton and ChooseOpponent, and x 52 for every other node; filled with the same level colors as the wide drawing. Its name is at the rect's x + 10, vertically centred, text-anchor start, dominant-baseline central, font-size 13, weight 700, fill color.on.accent
    outline.lines  drawn first, stroke color.border, stroke-width 1.5, fill none: for each child, a vertical line at the parent's x + 10 from the parent rect's bottom down to the child row's vertical centre, then a horizontal line from there to the child rect's left edge. Drawn over them, the thread, stroke color.thread, stroke-width 4, stroke-linecap round: lines 14,26 to 14,267 and 14,267 to 28,267 (to Engine), then 38,278 to 38,379 and 38,379 to 52,379 (to ComputerPlayer)
  copy
    tree.figure.label  "The Tic-Tac-Toe spec as a tree: every node, with the path from TicTacToe through Engine down to ComputerPlayer highlighted"
  binds
    svg       svg and outline each have role img with aria-label from tree.figure.label; they are switched only by their classes "ail-wide" and "ail-narrow" (so the hidden one also leaves the accessibility tree), and the wide svg comes first in the DOM
```
