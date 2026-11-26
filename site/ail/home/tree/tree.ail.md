# A tree of tasks

Why the spec is a tree, and why that matters for building it: every node is
the same kind of task, and each is compiled on its own. The idea comes from
Recursive Language Models (Zhang, Kraska and Khattab, MIT CSAIL).

More nodes in this folder, each in a file of its own: [`TreeFigure`](tree-figure.ail.md).

```ail
node TreeSection : view   level: experience
  why   Make plain that a spec is one recursive shape: a tree of tasks that are all alike, built one node at a time.   <- HomePage
  what
    the section has the id "tree", so the page can link to it
    a heading, the real Tic-Tac-Toe spec drawn as a tree with every node, three points on what the tree shape gives, and where the idea comes from, with a link to the paper
    Scenario: the tree is explained
      Given the page is open
      Then the section with the id "tree" has the level 2 heading "A tree of tasks, the same all the way down"
      And it has the level 3 headings "One shape at every level", "Built one node at a time" and "Checked node by node", in that order
      And the link "Read the paper (arXiv:2512.24601) ↗" leads to "https://arxiv.org/abs/2512.24601"
  look
    band      Section with id "tree", tone plain
    head      SectionHeading with eyebrow from tree.eyebrow, text from tree.heading, lead from tree.lead
    figure    a div: background color.surface.raised, radius.lg, pad clamp(16px, 4vw, 24px), overflow hidden; holding TreeFigure
    points    a div: display grid, grid-template-columns repeat(auto-fit, minmax(min(260px, 100%), 1fr)), gap space.4
    point     a div: background color.surface, a 1px solid color.border border, radius.lg, pad clamp(16px, 4vw, 24px); stack(v, gap: space.2, align: start) [ title, text ]
    title     an h3: font.lead, weight 700, color.text, margin 0
    text      a p: font.body, line-height 1.6, color.text.muted, margin 0
    cite      a div: background color.code, color color.code.text, radius.lg, pad clamp(16px, 4vw, 24px); stack(v, gap: space.2, align: start) [ cite.eyebrow, cite.title, cite.text, cite.link ]
    cite.eyebrow  a p: font.tiny, weight 700, letter-spacing 0.12em, color color.dot.amber, margin 0
    cite.title    an h3: font.display at 22px, weight 700, color color.code.text, margin 0
    cite.text     a p: font.body, line-height 1.6, color color.code.muted, max-width width.prose, margin 0
    cite.link     a link: display inline-flex, align-items center, min-height 44px, font.small, weight 700, color color.thread, no underline
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
