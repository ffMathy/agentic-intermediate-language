# Stop 7: the proof

More nodes in this folder, each in a file of its own: [`ProofScreens`](proof-screens.ail.md).

```ail
node StopProof : view   level: experience
  why   Show that the promise is not taken on trust: the verify line became a test that plays every game, and what the player sees is proven and pictured too.   <- Journey
  what
    the seventh stop, in the build color, showing the derived check, and screenshots of the screens the demo's checks end on
    it says that every check's final screen is screenshotted, compared with the spec's look by a model, and committed beside the spec it proves
    Scenario: the proof
      Given the page is open
      Then the article "stop-7" has the level 3 heading "Proof: the verify line becomes a test that plays every game."
      And the region named "Derived check excerpt" shows its seven lines, with "never loses" highlighted
  look
    stop     JourneyStop with number 7, color color.level.build, figure ProofScreens
  copy
    proof.depth     "proof"
    proof.chip      "PROOF"
    proof.reader    "everyone: a green check means the sentence at the top is true"
    proof.headline  "Proof: the verify line becomes a test that plays every game."
    proof.body      "The verify line from the specialist level became a derived check, pinned to a hash of the node: it plays every possible game against the computer and asserts that X never wins. What people see is proven too. The final screen of every check is screenshotted, a model compares it with the spec's look, and the screenshots are committed beside the spec they prove, so a reviewer sees exactly what was proven, next to what it was proven against. Every ail build runs it all, on your machine and in CI."
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
    proof.turns     "A green ail build, and committed screenshots of what it proved. If a change to the spec or the code ever let X win, or changed how the game looks, the build would fail and the change would be rejected."
  binds
    stop     JourneyStop with depth proof.depth, chip proof.chip, reader proof.reader, headline proof.headline, explanation proof.body, lines proof.line.1 to proof.line.7, label proof.label, file proof.file, highlight [proof.mark.1, proof.mark.2], turnsInto proof.turns
  uses      JourneyStop, ProofScreens
  children  ProofScreens
```
