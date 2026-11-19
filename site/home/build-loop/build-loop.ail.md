# How it builds

The day-to-day loop: write, build, check, and answer the compiler's questions.

```ail
node BuildLoop : view   level: experience
  why   Show that AIL is a way of working, not only a format: changes go into the spec, and the tools do the rest.   <- HomePage
  what
    a heading, a loop picture beside four numbered steps, and an example of a question the compiler asks instead of guessing
    the example is labelled as an illustration, with the place in the real spec that answers it
    Scenario: four steps
      Given the page is open
      Then the section with the id "loop" lists the steps "Write", "Build", "Check" and "Ask", in that order
      And it shows the text "Illustrative example."
  look
    band      Section with id "loop", tone plain
    head      SectionHeading with text from loop.heading, lead from loop.lead
    grid      a div: display grid, grid-template-columns repeat(auto-fit, minmax(min(300px, 100%), 1fr)), gap space.8, align-items center
    picture   LoopFigure
    steps     an ol: list-style none, margin 0, pad 0; stack(v, gap: space.4, align: stretch)
    step      stack(h, gap: space.3, align: start) [ number, words ]
    number    a 32px circle, flex 0 0 auto, display flex, centered, font.small, weight 800, color color.on.accent; Write color.level.product, Build color.level.build, Check color.step.check, Ask color.level.experience
    words     stack(v, gap: space.1, align: start) [ title, text ]
    title     an h3: font.lead, weight 700, color.text, margin 0
    text      a p: font.body, line-height 1.6, color.text.muted, margin 0
    stop      a div: background color.stop.soft, a 1px solid color.level.experience border, radius.md, pad space.4; the question as a p in font.mono at font.code, color.text, margin 0, with its first word in weight 700, color color.stop.text; then the note as a p in font.small, color.text.muted, margin space.2 0 0
  copy
    loop.heading    "How a spec becomes code you can trust"
    loop.lead       "Four steps, repeated for every change. You only ever edit the spec."
    loop.1.title    "Write"
    loop.1.text     "Change the spec, in plain words or with Claude Code's help. Generated code is never edited by hand."
    loop.2.title    "Build"
    loop.2.text     "ail build recompiles only the nodes whose spec changed. Each node is compiled by an agent that sees only its own slice of the tree."
    loop.3.title    "Check"
    loop.3.text     "ail check lints the spec, confirms every file was built from it, and runs every example, scenario and verify line as a test."
    loop.4.title    "Ask"
    loop.4.text     "When the spec leaves a gap, the compiler doesn't guess. It replies STOP with a question, and the answer goes into the spec."
    loop.stop.word  "STOP:"
    loop.stop.text  " after switching to the computer, does “New game” keep the computer as the opponent?"
    loop.stop.note  "Illustrative example. The real spec answers it in GameReducer: newGame → initial(game.opponent)."
  uses      Section, SectionHeading, Stack, LoopFigure
  children  LoopFigure
```

```ail
node LoopFigure : view   level: experience
  why   Show the four steps as a cycle around the lock file that ties code to spec.   <- BuildLoop
  what
    four colored circles on a ring, Write, Build, Check and Ask, with arrows going clockwise, and a padlock with "ail.lock.json" in the middle
    Scenario: the picture
      Given the section is shown
      Then an image named "Write, build, check and ask, in a loop around ail.lock.json" is shown
  look
    svg       viewBox 0 0 360 360, width 100%, max-width 360px, height auto, display block, margin 0 auto
    ring      circle cx 180 cy 180 r 130, fill none, stroke color.border, stroke-width 2
    heads     path "M-6 -6 L6 0 L-6 6 Z", fill color.text.muted, with transforms translate(272 88) rotate(45), translate(272 272) rotate(135), translate(88 272) rotate(225), translate(88 88) rotate(315)
    steps     circles r 32 at 180,50 (Write, color.level.product), 310,180 (Build, color.level.build), 180,310 (Check, color.step.check) and 50,180 (Ask, color.level.experience)
    number    text at cx, cy − 8, text-anchor middle, font-size 11, weight 700, fill color.on.accent, opacity 0.85
    name      text at cx, cy + 10, text-anchor middle, font-size 13, weight 700, fill color.on.accent
    lock      rect x 166 y 176 width 28 height 22 rx 4, fill color.text.muted; path "M172 176 V168 A8 8 0 0 1 188 168 V176", stroke color.text.muted, stroke-width 3, fill none
    file      mono text at 180, 218, text-anchor middle, font-size 12, fill color.text
  copy
    loop.figure.label  "Write, build, check and ask, in a loop around ail.lock.json"
    loop.figure.n1     "1"
    loop.figure.n2     "2"
    loop.figure.n3     "3"
    loop.figure.n4     "4"
    loop.figure.write  "Write"
    loop.figure.build  "Build"
    loop.figure.check  "Check"
    loop.figure.ask    "Ask"
    loop.figure.file   "ail.lock.json"
  binds
    svg       role img with aria-label from loop.figure.label
```
