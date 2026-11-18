```ail
node SpecSample : view   level: experience
  why   Seeing a node explains the format faster than describing it.   <- HomePage
  what
    a heading, one sentence, and the sample spec in a code block
    Scenario: the sample is shown exactly
      Given the page is open
      Then the code block named "Sample spec" shows the seven sample lines exactly, in order, keeping every space
  look
    layout   stack(v, gap: space.4, align: stretch) [ SectionHeading, intro, CodeBlock ]
    intro    Text.body, color.text.muted
  copy
    sample.heading  "What a spec looks like"
    sample.intro    "Plain language at the top, detail and proof further down. This node is the root of the Tic-Tac-Toe demo."
    sample.label    "Sample spec"
    sample.line.1   "node TicTacToe : system   level: product"
    sample.line.2   "  why   A quick, familiar game people can finish in under a minute."
    sample.line.3   "  what"
    sample.line.4   "    1. Two players take turns placing their mark.   refined-by: PlayAGame"
    sample.line.5   "    4. The computer never loses.                    refined-by: ComputerPlayer"
    sample.line.6   "    6. You can watch the computer play itself.      refined-by: WatchADemo"
    sample.line.7   "  children  App, BoardKit, Engine"
  uses  SectionHeading, CodeBlock
```
