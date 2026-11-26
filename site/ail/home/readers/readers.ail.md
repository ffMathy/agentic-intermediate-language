# One spec, four readers

The same tree serves four audiences. Picking a reader shows what that reader
reads and lights up the level written for them in the Tic-Tac-Toe tree.

More nodes, each in a folder of its own: [`ReadersTree`](readers-tree/readers-tree.ail.md).

```ail
node Readers : flow   level: experience
  why   Explain why levels exist: each level of the tree is written for one kind of reader, and each reader's view goes only as deep as they need.   <- HomePage
  what
    the section has the id "readers", so the page can link to it
    four tabs, "Stakeholder", "Design", "Engineer" and "Specialist", named together as "Readers"; "Stakeholder" is picked first
    the panel under the tabs names the level written for that reader, says what they read there, and lights up that level in the tree
    the left and right arrow keys move between tabs, wrapping around, and move focus with them
    Scenario: the first reader
      Given the page is open
      Then the tab "Stakeholder" is selected
      And the panel shows "PRODUCT LEVEL"
    Scenario: picking another reader
      Given the page is open
      When the visitor picks the tab "Specialist"
      Then the tab "Specialist" is selected and "Stakeholder" is not
      And the panel shows "SPECIALIST LEVEL"
    Scenario: arrow keys
      Given the tab "Stakeholder" has focus
      When the visitor presses the left arrow key
      Then the tab "Specialist" is selected and has focus
  look
    band      Section with id "readers", tone plain
    head      SectionHeading with text from readers.heading, lead from readers.lead
    tabs      a div with role tablist: display grid, grid-template-columns repeat(auto-fit, minmax(140px, 1fr)), gap space.2, max-width 640px [ tab × 4 ]
    tab       a native button: height 44px, pad 0 space.4, radius.md, font.sans at font.small, weight 600, cursor pointer
    picked    background the reader's color, a 1px solid border in the same color, color color.on.accent
    other     background color.surface, a 1px solid color.border border, color color.text
    colors    stakeholder color.level.product, design color.level.experience, engineer color.level.system, specialist color.level.specialist
    panel     a div with role tabpanel: background color.surface, a 1px solid color.border border, radius.lg, pad clamp(16px, 4vw, 24px); stack(v, gap: space.4, align: stretch) [ level, text, ReadersTree ]
    level     font.tiny, weight 700, letter-spacing 0.08em, the reader's color
    text      a p: font.lead, line-height 1.6, color.text, max-width width.prose, margin 0
  copy
    readers.heading       "One spec, four readers"
    readers.lead          "Each level of the tree is written for one kind of reader. Pick a reader to see which level is theirs: they start at the top and stop where the detail stops mattering to them."
    readers.label         "Readers"
    readers.stakeholder   "Stakeholder"
    readers.design        "Design"
    readers.engineer      "Engineer"
    readers.specialist    "Specialist"
    readers.stakeholder.level  "PRODUCT LEVEL"
    readers.design.level       "EXPERIENCE LEVEL"
    readers.engineer.level     "SYSTEM LEVEL"
    readers.specialist.level   "SPECIALIST LEVEL"
    readers.stakeholder.text   "Reads the six promises at the top and the scenarios under them in plain words, and can sign off on “The computer never loses.” without reading any code."
    readers.design.text        "Reads the scenarios, the layout in design tokens, and every word on screen, such as “X's turn”, “X wins!” and “New game”."
    readers.engineer.text      "Reads everything down to the contracts, with the specialists' how folded away: the types, and the examples that run as tests, such as evaluate(boardFrom("XOX/XOO/OXX")) => ({ kind: "draw" })."
    readers.specialist.text    "Reads the algorithm, its invariant and how it is proved: full minimax, memoized by board, checked against every possible game."
  binds
    state     reader: "stakeholder" | "design" | "engineer" | "specialist", starting at "stakeholder"
    tablist   aria-label from readers.label
    tab       role tab, id "reader-tab-{key}", aria-selected, aria-controls "reader-panel", tabIndex 0 when picked and -1 otherwise; click sets reader; ArrowRight and ArrowLeft set the next or previous reader in tab order, wrapping, and focus its tab
    panel     id "reader-panel", aria-labelledby the picked tab's id
    tree      ReadersTree with reader
  uses      Section, SectionHeading, Stack, ReadersTree
  children  ReadersTree
```
