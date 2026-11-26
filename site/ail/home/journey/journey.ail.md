# The journey

The centre of the page. One promise from the real Tic-Tac-Toe spec, "The
computer never loses.", followed from the product owner's requirements down to the
code, the check and the running game. Each stop has its own file in
[`stops/`](stops/).

More nodes, each in a folder of its own: [`JumpGauge`](jump-gauge/jump-gauge.ail.md), [`JourneyStop`](journey-stop/journey-stop.ail.md).

```ail
node Journey : view   level: experience
  why   Show what the levels of a spec are for by following one real sentence through all of them, down to the result.   <- HomePage
  what
    a heading, an introduction, a legend for the yellow thread, a map of the stops, then eight stops in order
    every stop is visible at once while scrolling; nothing needs a click to be read, and the page never scrolls by itself
    the excerpts are copied from the Tic-Tac-Toe spec, its generated code and its derived check, and each names its file
    Scenario: eight stops in order
      Given the page is open
      Then the section with the id "journey" holds eight level 3 headings, from "It starts with what the product owner wants." to "The result: try to beat it."
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
    journey.intro    "This is the real spec of the Tic-Tac-Toe demo, not a mock-up. We follow one of the product owner's requirements for Tic-Tac-Toe, “the computer never loses”, down to the code that keeps it. Stops 2 to 5 are the four levels of the spec, from plain promise to algorithm. Stops 6 to 8 are what the tools make from it: the code, the proof and the game. The yellow highlight marks the thread at every level."
    journey.legend   "the thread we are following"
  uses      Section, SectionHeading, Stack, JumpGauge, StopIdea, StopProduct, StopExperience, StopSystem, StopSpecialist, StopBuild, StopProof, StopResult
  children  JumpGauge, JourneyStop, StopIdea, StopProduct, StopExperience, StopSystem, StopSpecialist, StopBuild, StopProof, StopResult
```
