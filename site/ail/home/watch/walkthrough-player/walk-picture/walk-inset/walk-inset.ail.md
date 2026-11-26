# Walk inset

```ail
node WalkInset : view   level: experience
  why   Each chapter has one detail worth a closer look: a card of what the tool reads or writes, or a screenshot of the app it checks.   <- WalkPicture
  what
    a card shows its label and then its lines in a small code font, each on its own line, keeping their spaces
    a screenshot shows its label, the verdict when there is one, and the committed screenshot of that node at the end of that check
    a screenshot that is not among the committed ones shows nothing, and neither does an inset of kind none
    Scenario: a card
      Given a card labelled "Compile context: WatchADemo" with the lines "Target, design tokens, glossary" and "Why chain: TicTacToe → App"
      Then "Compile context: WatchADemo" is shown, then those two lines, each on its own line
    Scenario: a screenshot
      Given a screenshot of the node "PlayAGame" at the end of the check "winning", labelled "Your app today · localhost:3000", with the verdict "MATCHES"
      Then the image named "Screenshot of the app at the end of the check “winning”" is shown
      And "Your app today · localhost:3000" and "MATCHES" are shown above it
    Scenario: nothing
      Given an inset of kind none
      Then nothing is shown
  look
    card     a div: display flex, flex-direction column, gap space.2, min-width 0, pad space.3, background color.code, a 1px solid color.code.border border, radius.md
    label    a p: margin 0, font.mono at font.tiny, color color.code.muted, overflow-wrap anywhere, line-height 1.4
    lines    a div: display flex, flex-direction column, gap 0; each line a p: margin 0, font.mono at font.tiny, line-height 1.5, color color.code.text, white-space pre-wrap, overflow-wrap anywhere
    shot     a figure: margin 0, display flex, flex-direction column, gap space.2, min-width 0; holding [ caption, image ]
    caption  a figcaption: display flex, flex-wrap wrap, align-items center, gap space.2; the label in font.sans at font.tiny, weight 700, color color.code.muted; then, when given, the verdict pill
    pill     a span: pad 2px space.2, radius.pill, background color.pass, color color.on.accent, font.micro, weight 700, letter-spacing 0.08em
    image    an img: display block, width auto, height auto, max-width 100%, max-height 240px, align-self flex-start, object-fit contain, box-sizing border-box, background color.surface, a 1px solid color.code.border border, radius.md (at most 240px tall, so a screenshot never makes the player taller)
  copy
    walk.shot.alt  "Screenshot of the app at the end of the check “{test}”"
  binds
    props    inset: Inset
    data     specProjects from the spec module: of the project with key "tictactoe", the last shot whose node and test are the inset's (the end-to-end one when there is one)
    img      src the shot's src; alt from walk.shot.alt with {test} filled in
  uses      Walkthrough
```
