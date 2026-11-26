# Readers tree

```ail
node ReadersTree : view   level: experience
  why   Show which level of the real tree is written for each reader, so "levels" is a picture and not just a word.   <- Readers
  what
    a simplified Tic-Tac-Toe tree with thirteen of its nineteen nodes, and a note under it saying which parts are left out; the nodes written at the given reader's level are filled with their level's color, and the rest fade back
    below 600px viewport width the same tree is drawn as an indented outline, one node per row, so every name stays readable on a phone
    Scenario: the stakeholder's level
      Given the reader "stakeholder"
      Then an image named "The Tic-Tac-Toe spec tree, with the level written for the stakeholder highlighted" is shown
      And only the node "TicTacToe" is drawn highlighted in the wide tree
      And the text "Simplified: the six parts inside BoardKit and UiKit are not drawn." is shown
  look
    root      a div; stack(v, gap: space.2, align: stretch) [ svg, outline, note ]
    svg       class "ail-wide" (shown only at 600px viewport width or more); viewBox 0 0 640 200, width 100%, height auto
    nodes     rects width 96 height 24 rx 6; mono texts at the rect's center, text-anchor middle, dominant-baseline central, font-size 11
    row 0     y 8: TicTacToe x 272
    row 1     y 56: App x 60, BoardKit x 172, Engine x 380, UiKit x 488
    row 2     y 112: PlayAGame x 8, WatchADemo x 112, GameState x 224, Rules x 328, GameReducer x 432, ComputerPlayer x 536
    row 3     y 168: NewGameButton x 8, ChooseOpponent x 112
    edges     drawn first, lines from the parent's bottom center to the child's top center, stroke color.border, stroke-width 1: TicTacToe to App, BoardKit, Engine and UiKit; App to PlayAGame and WatchADemo; Engine to GameState, Rules, GameReducer and ComputerPlayer; PlayAGame to NewGameButton and ChooseOpponent
    outline   a second svg with class "ail-narrow" (shown only below 600px viewport width): viewBox 0 0 300 372, width 100%, max-width 320px, height auto. It has 13 rows in this order: TicTacToe, App, PlayAGame, NewGameButton, ChooseOpponent, WatchADemo, BoardKit, Engine, GameState, Rules, GameReducer, ComputerPlayer, UiKit. Row i (counting from 0) has a rect at y 4 + 28 × i, height 22, width 180, rx 6, at x 4 for TicTacToe, x 28 for App, BoardKit, Engine and UiKit, x 52 for PlayAGame, WatchADemo, GameState, Rules, GameReducer and ComputerPlayer, and x 76 for NewGameButton and ChooseOpponent. Its text is mono, font-size 13, at the rect's x + 10, vertically centred, text-anchor start, dominant-baseline central. Connectors are drawn first, stroke color.border, stroke-width 1: for each child, a vertical line at the parent's x + 10 from the parent rect's bottom down to the child row's vertical centre, then a horizontal line from there to the child rect's left edge
    lit       fill the reader's color, no stroke, text fill color.on.accent, weight 700
    unlit     fill color.surface.raised, stroke color.border, stroke-width 1, stroke-dasharray 3 3, text fill color.text.muted, weight 400; no opacity on the node or its text
    readers   stakeholder lights TicTacToe in color.level.product; design lights App, BoardKit, UiKit, PlayAGame, WatchADemo, NewGameButton and ChooseOpponent in color.level.experience; engineer lights Engine, GameState, Rules and GameReducer in color.level.system; specialist lights ComputerPlayer in color.level.specialist
    both      lit, unlit and readers apply to the nodes of both svg and outline
    note      a p from tree.note, shown at every viewport width and for every reader: font.sans at font.tiny, font-style italic, color color.text.muted, margin 0
  copy
    tree.label  "The Tic-Tac-Toe spec tree, with the level written for the {reader} highlighted"
    tree.note   "Simplified: the six parts inside BoardKit and UiKit are not drawn."
  binds
    props     reader: "stakeholder" | "design" | "engineer" | "specialist"
    svg       svg and outline each have role img with aria-label from tree.label; each node in both is a g with data-lit "true" or "false"; they are switched only by their classes "ail-wide" and "ail-narrow" (so the hidden one also leaves the accessibility tree), and the wide svg comes first in the DOM
  uses      Stack
```
