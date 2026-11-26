# Walk picture

```ail
node WalkPicture : view   level: experience
  why   Show which nodes of the spec a chapter touches and the state of each, so a build reads as work on a tree rather than a wall of log lines.   <- WalkthroughPlayer
  what
    the walkthrough's picture title, then the 16 compiled Tic-Tac-Toe nodes as boxes: the app and its screens as a tree on top, then the three libraries as bands with their nodes inside
    each box shows the node's name and its state, by its outline and by a short word, so the state never depends on colour alone; a node with no spec yet has a dotted outline, a muted name and no word
    under the tree, the chapter's inset, then, at 600px viewport width or more, a legend listing every state the walkthrough uses, each with its outline and what it means
    at 600px viewport width or more the whole tree is visible: it scales down with the space it has, and never scrolls or is cut off; below 600px it is replaced by a wrapped list of chips, "Name · word", for just the nodes whose state differs from the rest state, then a muted line saying how many other nodes there are and what their state means
    Scenario: a stale chapter
      Given the build walkthrough at its second chapter
      Then the image named "Tic-Tac-Toe spec · 16 nodes: TicTacToe: up to date; App: out of date; …" is shown, its name listing all 16 nodes in drawing order
      And the boxes of "WatchADemo" and "App" read "stale", and the box of "Rules" reads "✓ fresh"
    Scenario: nodes with no spec yet
      Given the adopt walkthrough at its first chapter
      Then the box of "PlayAGame" reads "the slice", and the box of "App" shows no word
      And the legend includes "no spec yet"
  look
    root     a div: display flex, flex-direction column, gap space.3, pad space.4, height 100%, box-sizing border-box, background color.code.side; holding [ title, row, legend ]; the title is a p: margin 0, font.sans at font.tiny, weight 700, letter-spacing 0.08em, text-transform uppercase, color color.code.muted
    row      a div: display flex, flex-direction column, gap space.4, align-items stretch; holding [ tree, chips, WalkInset with inset = walkthrough.beats[chapter].inset, in a div with min-width 0 ]
    tree     a div with class "ail-wide" and min-width 0 holding an svg: viewBox 0 0 480 436, width 100%, max-width 480px, height auto, display block, margin 0 auto (it scales down to the width it has)
    chips    a div with class "ail-narrow" (shown only below 600px viewport width) holding [ chiplist, rest ]; it sets no display of its own, because the class sets it; the chiplist is a ul: list-style none, margin 0, pad 0, display flex, flex-wrap wrap, gap space.2; the rest is a p: margin space.2 0 0, font.sans at font.small, color color.code.muted
    chip     an li: display inline-flex, align-items center, gap space.1, pad space.1 space.2, radius.md, background color.code (none for unwritten), a border in the state's stroke color and width, solid, or dotted for dasharray 1 2 and 2 3, or dashed for any other dasharray; font.sans at font.small, line-height 1.4, color color.code.text; the name in weight 600, then " · ", then the word in weight 700 in the state's word color; a state with no word shows only the name, in color.code.muted
    edges    drawn first, lines with stroke color.code.muted, stroke-width 1.5: 240,40 to 240,60; 240,96 to 144,116; 240,96 to 336,116; 144,152 to 74,172; 144,152 to 222,172
    bands    rects x 0, width 480, height 64, rx 8, fill color.code.bar, stroke color.code.border, stroke-width 1, at y 224, 296 and 368; in each a mono text at x 10, y band + 15, font-size 10, fill color.code.muted: "UiKit · library", "BoardKit · library", "Engine · library"
    boxes    rects height 36, rx 6: "TicTacToe" x 170 y 4 w 140; "App" x 170 y 60 w 140; "PlayAGame" x 74 y 116 w 140; "WatchADemo" x 266 y 116 w 140; "ChooseOpponent" x 4 y 172 w 140; "NewGameButton" x 152 y 172 w 140; "Stack" x 10 y 246 w 108; "Text" x 126 y 246 w 108; "Button" x 242 y 246 w 108; "Segmented" x 358 y 246 w 112; "BoardView" x 10 y 318 w 140; "StatusLine" x 158 y 318 w 140; "GameState" x 10 y 390 w 108; "Rules" x 126 y 390 w 108; "GameReducer" x 242 y 390 w 108; "ComputerPlayer" x 358 y 390 w 112
    labels   text-anchor middle at the box's horizontal centre: the name at y box + 15, font-size 12, weight 600, fill color.code.text; the word at y box + 29, font-size 10, weight 700; a box with no word has its name at y box + 22
    fresh      stroke color.dot.green, stroke-width 1.5, fill color.code; word in color.dot.green
    stale      stroke color.dot.amber, stroke-width 1.5, fill color.code; word in color.dot.amber
    writing    stroke color.thread, stroke-width 1.5, fill color.code; word in color.thread
    compiling  stroke color.thread, stroke-width 3, fill color.code; word in color.thread
    contract   stroke color.dot.green, stroke-width 1.5, stroke-dasharray 1 2, fill color.code; word in color.thread
    checking   stroke color.thread, stroke-width 1.5, stroke-dasharray 4 3, fill color.code; word in color.thread
    rejected   stroke color.dot.red, stroke-width 1.5, fill color.code; word in color.dot.red
    stopped    stroke color.dot.red, stroke-width 3, fill color.code; word in color.dot.red
    skipped    stroke color.code.muted, stroke-width 1.5, stroke-dasharray 4 3, fill color.code; word in color.code.muted
    unwritten  stroke color.code.muted, stroke-width 1.5, stroke-dasharray 2 3, fill none; no word; name in color.code.muted
    slice      stroke color.thread, stroke-width 2, stroke-dasharray 6 3, fill color.code; word in color.thread
    written    stroke color.code.text, stroke-width 1.5, fill color.code; word in color.code.text
    adopted    stroke color.level.experience, stroke-width 1.5, stroke-dasharray 5 3, fill color.code; word in color.level.experience
    proven     stroke color.pass, stroke-width 3, fill color.code; word in color.dot.green
    legend   a ul with class "ail-wide": list-style none, margin 0, pad 0, display flex, flex-wrap wrap, gap space.1 space.4, font.sans at font.tiny, color color.code.muted; each li: display flex, align-items center, gap space.2; an aria-hidden svg, viewBox 0 0 16 12, width 16px, height 12px, holding a rect x 1 y 1 width 14 height 10 rx 2 with that state's stroke, dasharray and fill and stroke-width 1.5, then the state's meaning
  copy
    walk.tree.label   "{picture}: {nodes}"
    walk.tree.node    "{name}: {meaning}"
    walk.word.fresh "✓ fresh"
    walk.word.stale "stale"
    walk.word.writing "writing"
    walk.word.compiling "building"
    walk.word.contract "contract only"
    walk.word.checking "checking"
    walk.word.rejected "rejected"
    walk.word.stopped "STOP"
    walk.word.skipped "skipped"
    walk.word.slice "the slice"
    walk.word.written "written"
    walk.word.adopted "adopted"
    walk.word.proven "✓ proven"
    walk.mean.fresh "up to date"
    walk.mean.stale "out of date"
    walk.mean.writing "spec being written"
    walk.mean.compiling "being compiled"
    walk.mean.contract "only its contract is sent"
    walk.mean.checking "being checked"
    walk.mean.rejected "attempt rejected"
    walk.mean.stopped "stopped with a question"
    walk.mean.skipped "waits for a node above it"
    walk.mean.unwritten "no spec yet"
    walk.mean.slice "the slice being adopted"
    walk.mean.written "spec written"
    walk.mean.adopted "adopted, not checked yet"
    walk.mean.proven "checked and proven"
    walk.chips "Nodes this chapter touches"
    walk.rest "the other {count} nodes: {meaning}"
    walk.rest.all "all {count} nodes: {meaning}"
  binds
    props    walkthrough: Walkthrough, chapter: integer
    words    each node's state is stateOf(walkthrough, chapter, its name); a box's word is walk.word.{its state}, and none for "unwritten"; its meaning, in the aria-label and in the legend, is walk.mean.{its state}; the legend has one li per state of statesIn(walkthrough), in that order
    svg      the tree has role img and aria-label walk.tree.label, with picture = walkthrough.picture and nodes = walk.tree.node with name the node and meaning walk.mean.{its state}, for each of NODES in order, joined by "; "; each node is a g with data-node its name and data-state its state; bands and edges are inside an aria-hidden g
    chips    one chip per name of NODES, in order, whose stateOf differs from walkthrough.rest; the ul has aria-label walk.chips; rest reads walk.rest with count = the number of nodes left out and meaning = walk.mean.{walkthrough.rest} (the meaning, not the word, because unwritten has no word), or walk.rest.all with count 16 when no node differs, and is left out when every node differs
  uses      Walkthrough, WalkInset
  children  WalkInset
```
