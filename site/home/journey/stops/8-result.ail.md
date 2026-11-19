# Stop 8: the result

The end of the journey is the real game, embedded from `./demo/`, where the
Pages workflow publishes it. The demo opens with a friend as the opponent, so
the stop tells the visitor to pick the computer first.

```ail
node StopResult : view   level: experience
  why   End the journey with the real product, so the visitor can test the promise with their own hands.   <- Journey
  what
    the last stop, in the accent color; its rail ends at its marker, and its figure is the playable game
    Scenario: the result
      Given the page is open
      Then the article "stop-8" has the level 3 heading "The result: try to beat it."
      And the region named "The promise, one last time" shows "    4. The computer never loses." with "The computer never loses." highlighted
  look
    stop     JourneyStop with number 8, color color.accent, last, figure ResultFrame
  copy
    result.depth     "result"
    result.chip      "RESULT"
    result.reader    "players"
    result.headline  "The result: try to beat it."
    result.body      "This is the game built from that spec, running right here. Pick Computer, then play as X. You can draw, but you can't win: a check proved it before this page was published."
    result.label     "The promise, one last time"
    result.file      "examples/tictactoe/tictactoe.ail.md"
    result.line.1    "    4. The computer never loses."
    result.mark      "The computer never loses."
    result.turns     "Every square, word and move in this game comes from the spec above. None of its code was written by hand."
  binds
    stop     JourneyStop with depth result.depth, chip result.chip, reader result.reader, headline result.headline, explanation result.body, lines [result.line.1], label result.label, file result.file, highlight [result.mark], turnsInto result.turns, last true
  uses      JourneyStop, ResultFrame
  children  ResultFrame
```

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
  look
    layout   stack(v, gap: space.3, align: center, style: width 100%) [ hint, device, open, trace ]
    hint     a p: background color.thread, color color.text, font.small, weight 600, radius.pill, pad space.1 space.3, margin 0
    device   a div: background color.code, pad space.3, radius.xl, width 100%, max-width 400px, box-sizing border-box
    frame    an iframe: width 100%, height 600px, border 0, radius.lg, background color.surface, display block
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
