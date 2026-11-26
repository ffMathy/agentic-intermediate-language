# Jump gauge

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
