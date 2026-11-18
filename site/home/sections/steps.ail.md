```ail
node Steps : view   level: experience
  why   Show the whole loop at a glance.   <- HomePage
  what
    a heading, then three steps; each step has a number, a title and one sentence
    the steps sit side by side when there is room and stack when there is not
    Scenario: the loop
      Given the page is open
      Then the steps are titled "Spec", "Build" and "Check", in that order, numbered 1, 2 and 3
  look
    layout   stack(v, gap: space.4, align: stretch) [ SectionHeading, steps ]
    steps    a grid of columns at least 220px wide that wrap, as many as fit, gap space.4
    step     background color.surface.raised, radius.md, pad space.4; stack(v, gap: space.2, align: start) [ number, title, text ]
    number   font.heading, weight 800, color.accent
    title    Text.body, weight 700
    text     Text.body, color.text.muted
  copy
    steps.heading  "Spec, build, check"
    steps.1.title  "Spec"
    steps.1.text   "Describe why, what and how as a tree of nodes, from plain product claims down to precise contracts."
    steps.2.title  "Build"
    steps.2.text   "An agent compiles each node from its own slice of the spec: nothing outside it, nothing left to guess."
    steps.3.title  "Check"
    steps.3.text   "Every example and scenario in the spec runs against the result, and unchanged nodes are never rebuilt."
  uses  SectionHeading
```
