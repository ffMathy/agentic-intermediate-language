# A tree of tasks

Why the spec is a tree, and why that matters for building it: every node is
the same kind of task, and each is compiled on its own. The idea comes from
Recursive Language Models (Zhang, Kraska and Khattab, MIT CSAIL).

```ail
node TreeSection : view   level: experience
  why   Make plain that a spec is one recursive shape: a tree of tasks that are all alike, built one node at a time.   <- HomePage
  what
    the section has the id "tree", so the page can link to it
    a heading, the real Tic-Tac-Toe spec drawn as a tree, three points on what the tree shape gives, and where the idea comes from, with a link to the paper
    Scenario: the tree is explained
      Given the page is open
      Then the section with the id "tree" has the level 2 heading "A tree of tasks, the same all the way down"
      And it has the level 3 headings "One shape at every level", "Built one node at a time" and "Checked node by node", in that order
      And the link "Read the paper (arXiv:2512.24601) ↗" leads to "https://arxiv.org/abs/2512.24601"
  look
    band      Section with id "tree", tone plain
    head      SectionHeading with eyebrow from tree.eyebrow, text from tree.heading, lead from tree.lead
    figure    a div: background color.surface.raised, radius.lg, pad space.6, overflow hidden; holding TreeFigure
    points    a div: display grid, grid-template-columns repeat(auto-fit, minmax(min(260px, 100%), 1fr)), gap space.4
    point     a div: background color.surface, a 1px solid color.border border, radius.lg, pad space.6; stack(v, gap: space.2, align: start) [ title, text ]
    title     an h3: font.lead, weight 700, color.text, margin 0
    text      a p: font.body, line-height 1.6, color.text.muted, margin 0
    cite      a div: background color.code, color color.code.text, radius.lg, pad space.6; stack(v, gap: space.2, align: start) [ cite.eyebrow, cite.title, cite.text, cite.link ]
    cite.eyebrow  a p: font.tiny, weight 700, letter-spacing 0.12em, color color.dot.amber, margin 0
    cite.title    an h3: font.display at 22px, weight 700, color color.code.text, margin 0
    cite.text     a p: font.body, line-height 1.6, color color.code.muted, max-width width.prose, margin 0
    cite.link     a link: font.small, weight 700, color color.thread, no underline
    layout    stack(v, gap: space.6, align: stretch) [ head, figure, points, cite ]
  copy
    tree.eyebrow      "RECURSIVE BY DESIGN"
    tree.heading      "A tree of tasks, the same all the way down"
    tree.lead         "Every node is a task that answers the same three questions: why it exists, what it does, and how. A node too big to answer at once hands parts to its children, which answer the same questions one level more precisely."
    tree.1.title      "One shape at every level"
    tree.1.text       "The root states the product's promises. Its children refine them into screens and rules, and theirs into algorithms. Every node, at every depth, has the same why, what and how."
    tree.2.title      "Built one node at a time"
    tree.2.text       "ail build compiles each node with a fresh call that sees only that node, its why chain and the contracts of the nodes it uses. ComputerPlayer is built from its own 27-line node, not from the whole spec."
    tree.3.title      "Checked node by node"
    tree.3.text       "Each node's examples and scenarios run as tests against its own code, so every branch is checked on its own, and together they keep the promise at the top."
    tree.cite.eyebrow "WHERE THE IDEA COMES FROM"
    tree.cite.title   "Inspired by Recursive Language Models"
    tree.cite.text    "Alex L. Zhang, Tim Kraska and Omar Khattab at MIT CSAIL let a model keep a long prompt outside itself and call itself, recursively, on just the parts it needs. AIL applies the same idea to building software: the spec is the environment, and each node is compiled by a fresh call that sees only its part."
    tree.cite.link    "Read the paper (arXiv:2512.24601) ↗"
  binds
    cite.link  a link to "https://arxiv.org/abs/2512.24601"
  uses      Section, SectionHeading, Stack, TreeFigure
  children  TreeFigure
```

```ail
node TreeFigure : view   level: experience
  why   Show the tree itself: the real nodes of the Tic-Tac-Toe spec, and the path the page follows down to the computer player.   <- TreeSection
  what
    the root, its four children, the children of Engine, and the names of the other children, joined by lines; the path from the root through Engine to ComputerPlayer is drawn as the yellow thread
    Scenario: the picture
      Given the section is shown
      Then an image named "The Tic-Tac-Toe spec as a tree: TicTacToe, its four children, and the four children of Engine, with the path down to ComputerPlayer highlighted" is shown
      And it contains the texts "TicTacToe", "Engine" and "ComputerPlayer"
  look
    svg       viewBox 0 0 960 310, width 100%, height auto, display block
    lines     drawn first, stroke color.border, stroke-width 2: from 480,54 to 120,120; to 360,120; to 600,120; to 840,120; and from 600,164 to 375,250; to 540,250; to 705,250; to 870,250
    thread    drawn over the lines, stroke color.thread, stroke-width 5, stroke-linecap round: from 480,54 to 600,120, and from 600,164 to 870,250
    boxes     rects with rx 10 and height 44; the name inside at the box's center x, y + 28, text-anchor middle, font-size 15, weight 700, fill color.on.accent
    root      box x 400 y 10 width 160, fill color.level.product: TicTacToe
    row.2     boxes y 120 width 160: x 40 App, x 280 BoardKit and x 760 UiKit, fill color.level.experience; x 520 Engine, fill color.level.system
    row.3     boxes y 250 width 150: x 300 GameState, x 465 Rules and x 630 GameReducer, fill color.level.system; x 795 ComputerPlayer, fill color.level.specialist
    others    text at y 192, text-anchor middle, font-size 13, fill color.text.muted: at x 120 "PlayAGame · WatchADemo", at x 360 "BoardView · StatusLine", at x 840 "Stack · Text · Button · Segmented"
  copy
    tree.figure.label  "The Tic-Tac-Toe spec as a tree: TicTacToe, its four children, and the four children of Engine, with the path down to ComputerPlayer highlighted"
  binds
    svg       role img with aria-label from tree.figure.label
```
