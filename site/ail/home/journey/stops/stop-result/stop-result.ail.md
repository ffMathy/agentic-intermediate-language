# Stop 8: the result

The end of the journey is the real game, embedded from `./demo/`, where the
Pages workflow publishes it. The demo opens with a friend as the opponent, so
the stop tells the visitor to pick the computer first.

More nodes, each in a folder of its own: [`ResultFrame`](result-frame/result-frame.ail.md).

```ail
node StopResult : view   level: experience
  why   End the journey with the real product, so the visitor can test the promise with their own hands.   <- Journey
  what
    the last stop, in the accent color; its rail ends at its marker, and its figure is the playable game
    Scenario: the result
      Given the page is open
      Then the article "stop-8" has the level 3 heading "The result: try to beat it."
      And the region named "The promise, one last time" shows "    4. The computer never loses." with "The computer never loses." highlighted
      And the stop reads "Apart from a short index.html, none of its code was written by hand."
  look
    stop     JourneyStop with number 8, color color.accent, last, figure ResultFrame, browse "#spec/tictactoe/tictactoe.ail.md"
  copy
    result.depth     "result"
    result.chip      "RESULT"
    result.reader    "players"
    result.headline  "The result: try to beat it."
    result.body      "This is the game built from that spec, running right here. Pick Computer, then play as X. You can draw, but you can't win: a check proved it before this page was published."
    result.label     "The promise, one last time"
    result.file      "examples/tictactoe/ail/tictactoe.ail.md"
    result.line.1    "    4. The computer never loses."
    result.mark      "The computer never loses."
    result.turns     "Every square, word and move in this game comes from the spec above. Apart from a short index.html, none of its code was written by hand."
  binds
    stop     JourneyStop with depth result.depth, chip result.chip, reader result.reader, headline result.headline, explanation result.body, lines [result.line.1], label result.label, file result.file, highlight [result.mark], turnsInto result.turns, last true
  uses      JourneyStop, ResultFrame
  children  ResultFrame
```
