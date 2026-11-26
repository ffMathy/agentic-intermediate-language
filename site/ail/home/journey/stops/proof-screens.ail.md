# Proof screens

```ail
node ProofScreens : view   level: experience
  why   Show that proof covers what people see, too: the screens the checks end on are pictured, judged against the look, and committed.   <- StopProof
  what
    two screenshots of the demo's play screen, taken at the end of its checks "winning" and "the computer answers", side by side when there is room, each with a check mark and the check's name under it
    under them, a line says the screenshots are committed beside the spec, and where
    Scenario: the screens
      Given the stop is shown
      Then it shows the images named "Screenshot at the end of the check “winning”" and "Screenshot at the end of the check “the computer answers”", in that order
      And it shows a line containing "examples/tictactoe/ail/app/play/shots/"
  look
    layout   stack(v, gap: space.3, align: stretch) [ grid, where ]
    grid     a div: display grid, grid-template-columns repeat(auto-fit, minmax(min(128px, 100%), 1fr)), gap space.3, width 100%
    shot     a figure element: margin 0, display flex, flex-direction column, gap space.1
    frame    an img: display block, width 100%, height auto, box-sizing border-box, background color.surface, a 1px solid color.border border, radius.md
    caption  a figcaption: font.tiny, color.text.muted, text-align center; the check mark in color.pass, weight 700, then one space, then the check's name in quotes
    where    a p: font.tiny, color.text.muted, margin 0, text-align center, overflow-wrap anywhere; the path in font.mono
  copy
    proof.shots.alt    "Screenshot at the end of the check “{test}”"
    proof.shots.mark   "✓"
    proof.shots.where  "Committed beside the spec, in"
    proof.shots.path   "examples/tictactoe/ail/app/play/shots/"
  binds
    data     specProjects from the spec module: of the project with key "tictactoe", the shots of node "PlayAGame" whose test is "winning", then the one whose test is "the computer answers"; a missing one is left out
    img      src the shot's src; alt from proof.shots.alt with {test} filled in
    caption  proof.shots.mark, one space, then “ + the shot's test + ”
    where    proof.shots.where, one space, then the path in a code element
  uses     Stack
```
