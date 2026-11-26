# Result frame

```ail
node ResultFrame : view   level: experience
  why   Show the finished game inside the page, with a hint to make the challenge fair, and where each thing on screen came from.   <- StopResult
  what
    a hint to pick the computer, the live game in a dark frame, a link to open it on its own, and three lines that trace what is on screen back to the spec
    Scenario: the game is embedded
      Given the stop is shown
      Then a frame titled "Tic-Tac-Toe, built from its AIL spec" shows "./demo/"
      And the link "Open the game full screen ↗" leads to "./demo/"
      And the hint reads "Pick “Computer”, then play as X"
    Scenario: the game fits a phone
      Given the viewport is 375px wide
      When the stop is shown
      Then the frame titled "Tic-Tac-Toe, built from its AIL spec" is 520px tall
  look
    layout   stack(v, gap: space.3, align: center, style: width 100%) [ hint, device, open, trace ]
    hint     a p: background color.thread, color color.text, font.small, weight 600, radius.pill, pad space.1 space.3, margin 0
    device   a div: background color.code, pad clamp(4px, 2vw, 12px), radius.xl, width 100%, max-width 400px, box-sizing border-box
    frame    an iframe: width 100%, height 60vw, min-height 520px, max-height 600px, border 0, radius.lg, background color.surface, display block
    open     a link: font.small, weight 600, color.accent
    trace    a ul: list-style none, margin 0, pad 0, width 100%, max-width 400px; stack(v, gap: space.1, align: stretch); each li font.small, color.text: what is seen, then " ← ", then the source in font.mono, color.text.muted
  copy
    result.hint      "Pick “Computer”, then play as X"
    result.title     "Tic-Tac-Toe, built from its AIL spec"
    result.open      "Open the game full screen ↗"
    result.trace.1   "“X's turn”"
    result.trace.1s  "StatusLine copy"
    result.trace.2   "the O after 300 ms"
    result.trace.2s  "PlayAGame decision"
    result.trace.3   "the square the O picks"
    result.trace.3s  "ComputerPlayer"
  binds
    frame    src "./demo/", title from result.title, loading "lazy"
    open     a link to "./demo/"
  uses  Stack
```
