# Stop 7: the proof

```ail
node StopProof : view   level: experience
  why   Show that the promise is not taken on trust: the verify line became a test that plays every game.   <- Journey
  what
    the seventh stop, in the build color, showing the derived check
    Scenario: the proof
      Given the page is open
      Then the article "stop-7" has the level 3 heading "Proof: the verify line becomes a test that plays every game."
      And the region named "Derived check excerpt" shows its seven lines, with "never loses" highlighted
  look
    stop     JourneyStop with number 7, color color.level.build, figure ProofFigure
  copy
    proof.depth     "proof"
    proof.chip      "PROOF"
    proof.reader    "everyone: a green check means the sentence at the top is true"
    proof.headline  "Proof: the verify line becomes a test that plays every game."
    proof.body      "The verify line from the specialist level was turned into a derived check, pinned to a hash of the node. It tries every possible sequence of X moves against the computer and asserts that X never wins. ail check runs it with every other example and scenario, on your machine and in CI."
    proof.label     "Derived check excerpt"
    proof.file      "examples/tictactoe/checks/engine/computer-player/computer-player.test.ts"
    proof.line.1    "// ail-derived-from: ComputerPlayer@0c990bfbddc62e20"
    proof.line.2    "test("never loses", () => {"
    proof.line.3    "  …"
    proof.line.4    "  explore(Array(9).fill(null), "X");"
    proof.line.5    "  expect(games).toBeGreaterThan(0);"
    proof.line.6    "  expect(xWins).toBe(0);"
    proof.line.7    "});"
    proof.mark.1    "never loses"
    proof.mark.2    "expect(xWins).toBe(0);"
    proof.turns     "A green ail check. If a change to the spec or the code ever let X win, the check would fail and the change would be rejected."
  binds
    stop     JourneyStop with depth proof.depth, chip proof.chip, reader proof.reader, headline proof.headline, explanation proof.body, lines proof.line.1 to proof.line.7, label proof.label, file proof.file, highlight [proof.mark.1, proof.mark.2], turnsInto proof.turns
  uses      JourneyStop, ProofFigure
  children  ProofFigure
```

```ail
node ProofFigure : view   level: experience
  why   Show that one unbroken thread runs from the promise at the top to the passing test at the bottom.   <- StopProof
  what
    five stacked chips, one per level the promise passed through, joined by the yellow thread, ending in a green check
    Scenario: the picture
      Given the stop is shown
      Then an image named "The thread runs from the promise through the scenario, the rules and the invariant to a passing test" is shown
      And it contains the texts "promise · product" and "test · never loses"
  look
    svg      viewBox 0 0 300 280, width 100%, max-width 300px, height auto, display block
    thread   line 30,27 to 30,251, stroke color.thread.strong, stroke-width 4, stroke-linecap round; and for each chip a line from 30, its center y, to 50, its center y, same stroke
    chips    rects x 50 width 200 height 34 rx 17 at y 10, 66, 122, 178 and 234, filled color.level.product, color.level.experience, color.level.system, color.level.specialist and color.level.build
    labels   texts at x 150, chip y + 22, text-anchor middle, font-size 12, weight 700, fill color.on.accent
    tick     line 250,251 to 258,251, stroke color.thread.strong, stroke-width 4; circle cx 274 cy 251 r 16, fill color.pass; path "M266 251 L272 257 L283 245", stroke color.on.accent, stroke-width 3, fill none, stroke-linecap round, stroke-linejoin round
  copy
    proof.figure.label  "The thread runs from the promise through the scenario, the rules and the invariant to a passing test"
    proof.figure.1      "promise · product"
    proof.figure.2      "scenario · experience"
    proof.figure.3      "rules · system"
    proof.figure.4      "invariant · specialist"
    proof.figure.5      "test · never loses"
  binds
    svg      role img with aria-label from proof.figure.label
```
