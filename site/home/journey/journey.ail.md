# The journey

The centre of the page. One promise from the real Tic-Tac-Toe spec, "The
computer never loses.", followed from the product owner's sentence down to the
code, the check and the running game. Each stop has its own file in
[`stops/`](stops/).

```ail
node Journey : view   level: experience
  why   Show what the levels of a spec are for by following one real sentence through all of them, down to the result.   <- HomePage
  what
    a heading, an introduction, a legend for the yellow thread, a map of the stops, then eight stops in order
    every stop is visible at once while scrolling; nothing needs a click to be read, and the page never scrolls by itself
    the excerpts are copied from the Tic-Tac-Toe spec, its generated code and its derived check, and each names its file
    Scenario: eight stops in order
      Given the page is open
      Then the section with the id "journey" holds eight level 3 headings, from "It starts as a sentence anyone could say." to "The result: try to beat it."
      And the stops have the ids "stop-1" to "stop-8", in order
    Scenario: the thread is explained
      Given the page is open
      Then the legend reads "the thread we are following"
  look
    band      Section with id "journey", tone plain
    head      SectionHeading with eyebrow from journey.eyebrow, text from journey.heading, lead from journey.intro
    legend    stack(h, gap: space.2, align: center) [ swatch, label ]; swatch a 14px by 14px span, radius 3px, background color.thread, a 1px solid color.thread.strong border; label font.small, color.text.muted
    map       JumpGauge, under the legend
    stops     an ol element: list-style none, margin 0, pad 0; one li per stop, no gap between them, so each stop's rail segment meets the next
    order     StopIdea, StopProduct, StopExperience, StopSystem, StopSpecialist, StopBuild, StopProof, StopResult
  copy
    journey.eyebrow  "THE JOURNEY"
    journey.heading  "Follow one sentence all the way down"
    journey.intro    "This is the real spec of the Tic-Tac-Toe demo, not a mock-up. We follow one promise, “the computer never loses”, from the product owner's sentence to the code that keeps it. Stops 2 to 5 are the four levels of the spec, from plain promise to algorithm. Stops 6 to 8 are what the tools make from it: the code, the proof and the game. The yellow highlight marks the thread at every level."
    journey.legend   "the thread we are following"
  uses      Section, SectionHeading, Stack, JumpGauge, StopIdea, StopProduct, StopExperience, StopSystem, StopSpecialist, StopBuild, StopProof, StopResult
  children  JumpGauge, JourneyStop, StopIdea, StopProduct, StopExperience, StopSystem, StopSpecialist, StopBuild, StopProof, StopResult
```

```ail
node JumpGauge : view   level: experience
  why   A visitor who wants one level should reach it in one click.   <- Journey
  what
    eight pills, one per stop, each in its stop's color, with no lines between them, in three groups: pill 1 on its own, pills 2 to 5 under the label "The spec: four levels", and pills 6 to 8 under the label "What it becomes"
    when the row runs out of room a whole group moves onto the next line, and inside a group the pills wrap
    every pill is at least 44px tall, so it is easy to tap
    Scenario: every pill leads to its stop
      Given the page is open
      Then the navigation named "Journey stops" has the links "1 Idea", "2 Product", "3 Experience", "4 System", "5 Specialist", "6 Build", "7 Proof" and "8 Play"
      And they lead to "#stop-1" to "#stop-8", in order
    Scenario: the gauge shows which stops are the spec
      Given the page is open
      Then the navigation named "Journey stops" shows the text "The spec: four levels" before the link "2 Product" and the text "What it becomes" before the link "6 Build"
  look
    row         a nav element; stack(h, gap: space.4, align: end, wrap: true) [ start, specGroup, outGroup ]
    start       pill 1 on its own, with no label above it
    group       stack(v, gap: space.1, align: start) [ groupLabel, groupPills ]; specGroup holds pills 2 to 5, outGroup holds pills 6 to 8
    groupLabel  a span: font.micro, weight 700, uppercase, letter-spacing 0.08em, color.text.muted
    groupPills  stack(h, gap: space.2, align: center, wrap: true) [ pill, pill, … ]
    pill    a link: display inline-flex, align-items center, min-height 44px, pad 0 space.3, radius.pill, background color.surface, a 1px solid border in the stop's color, text in the stop's color, font.small, weight 600, no underline
    colors  1 color.accent, 2 color.level.product, 3 color.level.experience, 4 color.level.system, 5 color.level.specialist, 6 color.level.build, 7 color.level.build, 8 color.accent
  copy
    gauge.label  "Journey stops"
    gauge.1      "1 Idea"
    gauge.2      "2 Product"
    gauge.3      "3 Experience"
    gauge.4      "4 System"
    gauge.5      "5 Specialist"
    gauge.6      "6 Build"
    gauge.7      "7 Proof"
    gauge.8      "8 Play"
    gauge.group.spec  "The spec: four levels"
    gauge.group.out   "What it becomes"
  binds
    row     aria-label from gauge.label
    pill    pill n is a link to "#stop-{n}"
    groupLabel  specGroup from gauge.group.spec, outGroup from gauge.group.out
  uses  Stack
```

```ail
node JourneyStop : view   level: experience
  why   Every stop has the same anatomy, so the visitor compares levels instead of learning a new layout each time.   <- Journey
  what
    a numbered marker on a vertical rail in the stop's color, with a short depth label under the marker
    in this order: the level chip, who reads this level, a level 3 heading, an explanation and a figure, the spec excerpt with the thread highlighted, and what this level turns into
    the explanation sits beside the figure when there is room, and above it when there is not; the excerpt and what it turns into run the full width of the stop below them
    on a 390px-wide screen each figure's drawing is at least 300px wide, so a 360-unit figure draws at no less than 0.83 scale
    the last stop's rail ends at its marker
    Scenario: a stop
      Given the number 4, the chip "SYSTEM", the reader "engineers", the headline "System level", the excerpt label "Spec excerpt" and the turns-into text "Tests."
      Then an article with the id "stop-4" shows the marker "4", "SYSTEM", "Who reads this: engineers" and a level 3 heading "System level"
      And it holds the region named "Spec excerpt" and the text "Turns into:" followed by "Tests."
  look
    stop      an article with id "stop-{number}": display grid, grid-template-columns 56px minmax(0, 1fr), column-gap space.4, pad 0 0 space.12 0, scroll-margin-top space.4; below 600px viewport width grid-template-columns 32px minmax(0, 1fr) and column-gap space.3
    rail      column 1, position relative
    segment   an aria-hidden div, position absolute, left 26px, top 0, width 4px, background the stop's color; bottom 0, or height 36px when last; below 600px viewport width left 14px
    marker    an aria-hidden div, position relative, margin-left 10px, width 36px, height 36px, box-sizing border-box, radius.pill, background the stop's color, a 3px solid color.surface border, box-shadow 0 0 0 1px the stop's color, color color.on.accent, font.small, weight 700, display flex, centered; below 600px viewport width margin-left 2px, width 28px, height 28px, font.micro
    depth     a div, position relative, margin-top space.2, width 56px, text-align center, font.micro, weight 700, uppercase, letter-spacing 0.08em, color.text.muted, background color.page, pad space.1 0; below 600px viewport width it is not shown (the chip already names the level)
    content   column 2; stack(v, gap: space.4, align: stretch) [ top, headline, body, excerpt, turns ]
    top       stack(h, gap: space.3, align: center, wrap: true) [ chip, reader ]
    chip      a span: background the stop's color, color color.on.accent, font.micro, weight 700, letter-spacing 0.08em, radius.pill, pad space.1 space.3
    reader    font.small, color.text.muted
    headline  an h3: font.stop, weight 800, line-height 1.2, letter-spacing -0.01em, color.text, margin 0
    body      a div: display grid, grid-template-columns repeat(auto-fit, minmax(min(300px, 100%), 1fr)), gap space.6, align-items center; holds explain, then figure
    explain   a p: font.body, line-height 1.6, color.text.muted, max-width width.prose, margin 0
    excerpt   CodeBlock with lines, label, caption from file, highlight, and edge the stop's color
    turns     a p: max-width width.prose, background color.accent.soft, radius.md, pad space.2 space.4, font.small, line-height 1.5, color.text, margin 0; the label in weight 700 color.accent, then one space, then the text
    figure    a div: background color.surface.raised, radius.lg, pad space.4 (pad space.3 space.1 below 600px viewport width), min-height 200px, min-width 0, display flex, align-items center, justify-content center
  copy
    stop.reader  "Who reads this: {reader}"
    stop.turns   "Turns into:"
  binds
    props    number: number, color: token name, depth: string, chip: string, reader: string, headline: string, explanation: string, lines: string[], label: string, file: string, highlight: string[], turnsInto: string, figure: React node, last?: boolean
  uses  Stack, CodeBlock
```
