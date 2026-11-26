# Pull request diff

```ail
node PullRequestDiff : view   level: experience
  why   The spec is the first thing a reviewer reads: show the change to it as a diff, the way a pull request shows any file.   <- SamplePullRequest
  what
    the demo's spec file, with the lines the change added, removed and kept around them, each kind marked
    Scenario: the spec change
      Given the diff is shown
      Then it shows "examples/tictactoe/ail/app/demo/demo.ail.md"
      And it shows the line "+    Scenario: watch again"
      And it shows the line "-    layout   stack(v, gap: space.4, align: center) [ StatusLine, BoardView ]"
  look
    file       a div: a 1px solid color.border border, radius.md, overflow hidden, background color.surface, min-width 0
    filebar    a div: display flex, flex-wrap wrap, align-items center, gap space.2, pad space.2 space.3, background color.surface.raised, a 1px solid color.border bottom border; the path in font.mono at font.tiny, color.text, overflow-wrap anywhere, flex 1 1 200px; then the tag
    tag        a span: pad 2px space.2, radius.pill, font.micro, weight 700, letter-spacing 0.04em, background color.level.product, color color.on.accent
    diff       a pre: margin 0, overflow-x auto, font.mono at font.tiny, line-height 1.7, color color.text; each line a div with white-space pre, pad 0 space.3, min-width max-content
    added      background rgba(21, 128, 61, 0.12); the leading "+" in color.pass, weight 700
    removed    background rgba(220, 38, 38, 0.10); the leading "-" in color.player.o, weight 700
    hunk       background color.accent.soft, color color.text.muted
  copy
    pr.spec.path    "examples/tictactoe/ail/app/demo/demo.ail.md"
    pr.spec.tag     "spec"
    pr.diff.1       "@@ node WatchADemo : flow   level: experience"
    pr.diff.2       "     the board can't be picked during the demo"
    pr.diff.3       "+    "Watch again" appears once the demo has ended"
    pr.diff.4       "@@ Scenario: perfect play ends in a draw"
    pr.diff.5       "       Then the status says "It's a draw""
    pr.diff.6       "+      And "Watch again" is shown"
    pr.diff.7       "+    Scenario: watch again"
    pr.diff.8       "+      Given the demo has ended"
    pr.diff.9       "+      When the viewer presses "Watch again""
    pr.diff.10      "+      Then the board is empty, the status says "X's turn", and "Watch again" is gone"
    pr.diff.11      "@@ look"
    pr.diff.12      "-    layout   stack(v, gap: space.4, align: center) [ StatusLine, BoardView ]"
    pr.diff.13      "+    layout   stack(v, gap: space.4, align: center) [ StatusLine, BoardView, again ]"
    pr.diff.14      "+    again    Button.secondary, only once the demo has ended"
    pr.diff.15      "+  copy"
    pr.diff.16      "+    demo.again  "Watch again""
  binds
    diff       the lines pr.diff.1 to pr.diff.16, in order
    lines      a diff line's first character says what it is: "@" a hunk, "+" added, "-" removed, anything else unchanged; the line is shown whole, its first character included
```
