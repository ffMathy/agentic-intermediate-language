# One spec, four readers

The same tree serves four audiences. Picking a reader shows what that reader
reads and lights up their part of the Tic-Tac-Toe tree.

```ail
node Readers : flow   level: experience
  why   Explain why levels exist: each kind of reader reads only the part of the tree written for them.   <- HomePage
  what
    four tabs, "Stakeholder", "Design", "Engineer" and "Specialist", named together as "Readers"; "Stakeholder" is picked first
    the panel under the tabs says what that reader reads, shows the command that renders their view, and lights up their nodes in the tree
    the left and right arrow keys move between tabs, wrapping around, and move focus with them
    Scenario: the first reader
      Given the page is open
      Then the tab "Stakeholder" is selected
      And the panel shows "ail show stakeholder"
    Scenario: picking another reader
      Given the page is open
      When the visitor picks the tab "Specialist"
      Then the tab "Specialist" is selected and "Stakeholder" is not
      And the panel shows "ail show specialist ai"
    Scenario: arrow keys
      Given the tab "Stakeholder" has focus
      When the visitor presses the left arrow key
      Then the tab "Specialist" is selected and has focus
  look
    band      Section with id "readers", tone raised
    head      SectionHeading with text from readers.heading, lead from readers.lead
    tabs      a div with role tablist; stack(h, gap: space.2, align: center, wrap: true) [ tab × 4 ]
    tab       a native button: height 40px, pad 0 space.4, radius.md, font.sans at font.small, weight 600, cursor pointer
    picked    background the reader's color, a 1px solid border in the same color, color color.on.accent
    other     background color.surface, a 1px solid color.border border, color color.text
    colors    stakeholder color.level.product, design color.level.experience, engineer color.level.system, specialist color.level.specialist
    panel     a div with role tabpanel: background color.surface, a 1px solid color.border border, radius.lg, pad space.6; stack(v, gap: space.4, align: stretch) [ level, text, command, ReadersTree ]
    level     font.micro, weight 700, letter-spacing 0.08em, the reader's color
    text      a p: font.lead, line-height 1.6, color.text, max-width width.prose, margin 0
    command   a code element, align-self flex-start: background color.code, color color.code.text, font.mono at font.code, radius.sm, pad space.1 space.2
  copy
    readers.heading       "One spec, four readers"
    readers.lead          "Nobody reads the whole tree. ail show renders it for each audience, and each reader stops where the detail stops mattering to them."
    readers.label         "Readers"
    readers.stakeholder   "Stakeholder"
    readers.design        "Design"
    readers.engineer      "Engineer"
    readers.specialist    "Specialist"
    readers.stakeholder.level  "PRODUCT LEVEL"
    readers.design.level       "EXPERIENCE LEVEL"
    readers.engineer.level     "SYSTEM LEVEL"
    readers.specialist.level   "SPECIALIST LEVEL"
    readers.stakeholder.text   "Reads the six promises at the top of the tree, and can sign off on “The computer never loses.” without reading any code."
    readers.design.text        "Reads the scenarios, the layout in design tokens, and every word on screen, such as “X's turn”, “X wins!” and “New game”."
    readers.engineer.text      "Reads the types, the contracts and the examples that run as tests, such as evaluate(boardFrom("XOX/XOO/OXX")) => ({ kind: "draw" })."
    readers.specialist.text    "Reads the algorithm, its invariant and how it is proved: full minimax, memoized by board, checked against every possible game."
    readers.stakeholder.cmd    "ail show stakeholder"
    readers.design.cmd         "ail show design"
    readers.engineer.cmd       "ail show engineer"
    readers.specialist.cmd     "ail show specialist ai"
  binds
    state     useState("stakeholder") for reader: "stakeholder" | "design" | "engineer" | "specialist"
    tablist   aria-label from readers.label
    tab       role tab, id "reader-tab-{key}", aria-selected, aria-controls "reader-panel", tabIndex 0 when picked and -1 otherwise; click sets reader; ArrowRight and ArrowLeft set the next or previous reader in tab order, wrapping, and focus its tab
    panel     id "reader-panel", aria-labelledby the picked tab's id
    tree      ReadersTree with reader
  uses      Section, SectionHeading, Stack, ReadersTree
  children  ReadersTree
```

```ail
node ReadersTree : view   level: experience
  why   Show where each reader's part sits in the real tree, so "levels" is a picture and not just a word.   <- Readers
  what
    a simplified Tic-Tac-Toe tree with fourteen nodes; the nodes the given reader reads are filled with their level's color, and the rest fade back
    Scenario: the stakeholder's part
      Given the reader "stakeholder"
      Then an image named "The Tic-Tac-Toe spec tree, with what the stakeholder reads highlighted" is shown
      And only the node "TicTacToe" is drawn highlighted
  look
    svg       viewBox 0 0 640 200, width 100%, height auto, display block
    nodes     rects width 96 height 24 rx 6; mono texts at the rect's center, text-anchor middle, dominant-baseline central, font-size 11
    row 0     y 8: TicTacToe x 272
    row 1     y 56: App x 60, BoardKit x 172, Engine x 380, UiKit x 488
    row 2     y 112: PlayAGame x 8, WatchADemo x 112, GameState x 224, Rules x 328, GameReducer x 432, ComputerPlayer x 536
    row 3     y 168: NewGameButton x 8, ChooseOpponent x 112
    edges     drawn first, lines from the parent's bottom center to the child's top center, stroke color.border, stroke-width 1: TicTacToe to App, BoardKit, Engine and UiKit; App to PlayAGame and WatchADemo; Engine to GameState, Rules, GameReducer and ComputerPlayer; PlayAGame to NewGameButton and ChooseOpponent
    lit       fill the reader's color, no stroke, text fill color.on.accent, weight 700
    unlit     fill color.surface, stroke color.border, stroke-width 1, text fill color.text.muted, opacity 0.55
    readers   stakeholder lights TicTacToe in color.level.product; design lights App, BoardKit, UiKit, PlayAGame, WatchADemo, NewGameButton and ChooseOpponent in color.level.experience; engineer lights Engine, GameState, Rules and GameReducer in color.level.system; specialist lights ComputerPlayer in color.level.specialist
  copy
    tree.label  "The Tic-Tac-Toe spec tree, with what the {reader} reads highlighted"
  binds
    props     reader: "stakeholder" | "design" | "engineer" | "specialist"
    svg       role img with aria-label from tree.label; each node is a g with data-lit "true" or "false"
```
