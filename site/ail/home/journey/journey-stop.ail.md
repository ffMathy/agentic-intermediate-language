# Journey stop

```ail
node JourneyStop : view   level: experience
  why   Every stop has the same anatomy, so the visitor compares levels instead of learning a new layout each time.   <- Journey
  what
    a numbered marker on a vertical rail in the stop's color, with a short depth label under the marker
    in this order: the level chip, who reads this level, a level 3 heading, an explanation and a figure, the spec excerpt with the thread highlighted, and what this level turns into
    the explanation sits beside the figure when there is room, and above it when there is not; the excerpt and what it turns into run the full width of the stop below them
    when the stop names a spec file to browse, a link under the excerpt opens that whole file in the spec browser
    on a 390px-wide screen each figure's drawing is at least 300px wide, so a 360-unit figure draws at no less than 0.83 scale
    the last stop's rail ends at its marker
    the depth label is a short word of at most 7 characters (such as "depth 3" or "result"), so it fits its 56px box
    Scenario: a stop
      Given the number 4, the color "color.level.system", the depth "depth 3", the chip "SYSTEM", the reader "engineers", the headline "System level", the excerpt label "Spec excerpt" and the turns-into text "Tests."
      Then an article with the id "stop-4" shows the marker "4", "SYSTEM", "Who reads this: engineers" and a level 3 heading "System level"
      And it holds the region named "Spec excerpt" and the text "Turns into:" followed by "Tests."
    Scenario: a stop with a file to browse
      Given a stop with the browse link "#spec/tictactoe/ail-file.ail.md"
      Then a link reading "Open the whole file in the spec browser ↓" leads to "#spec/tictactoe/ail-file.ail.md"
  look
    stop      an article with id "stop-{number}": display grid, grid-template-columns clamp(32px, 9vw, 56px) minmax(0, 1fr) (the rail column), column-gap clamp(12px, 3vw, 16px), pad 0 0 space.12 0, scroll-margin-top space.4
    rail      column 1, position relative
    segment   an aria-hidden div, position absolute, left calc(clamp(32px, 9vw, 56px) / 2 - 2px) (centred in the rail column), top 0, width 4px, background the stop's color; bottom 0, or height 36px when last
    marker    an aria-hidden div, position relative, margin-left calc((clamp(32px, 9vw, 56px) - clamp(28px, 7vw, 36px)) / 2), width clamp(28px, 7vw, 36px), height clamp(28px, 7vw, 36px), box-sizing border-box, radius.pill, background the stop's color, a 3px solid color.surface border, box-shadow 0 0 0 1px the stop's color, color color.on.accent, font size clamp(var(--font-micro), 3vw, var(--font-small)), weight 700, display flex, centered
    depth     a div with class "ail-wide" (so it is not shown below 600px viewport width; the chip already names the level), position relative, margin-top space.2, width 56px, text-align center, font.micro, weight 700, uppercase, letter-spacing 0.08em, color.text.muted, background color.page, pad space.1 0
    content   column 2; stack(v, gap: space.4, align: stretch) [ top, headline, body, excerpt, browse, turns ]
    top       stack(h, gap: space.3, align: center, wrap: true) [ chip, reader ]
    chip      a span: background the stop's color, color color.on.accent, font.micro, weight 700, letter-spacing 0.08em, radius.pill, pad space.1 space.3
    reader    font.small, color.text.muted
    headline  an h3: font.display at font.stop, weight 700, line-height 1.15, letter-spacing -0.01em, color.text, margin 0
    body      a div: display grid, grid-template-columns repeat(auto-fit, minmax(min(300px, 100%), 1fr)), gap space.6, align-items start; holds explain, then figure
    explain   a p: font.body, line-height 1.6, color.text.muted, max-width width.prose, margin 0
    excerpt   CodeBlock with lines, label, caption from file, highlight, and edge the stop's color
    browse    only when browse is given: a link, align-self flex-start, font.small, weight 600, color color.accent, no underline
    turns     a p: max-width width.prose, background color.accent.soft, radius.md, pad space.2 space.4, font.small, line-height 1.5, color.text, margin 0; the label in weight 700 color.accent, then one space, then the text
    figure    a div: background color.surface.raised, radius.lg, pad clamp(12px, 2vw, 16px) clamp(4px, 2vw, 16px), min-height 200px, min-width 0, display flex, align-items center, justify-content center
  copy
    stop.reader  "Who reads this: {reader}"
    stop.turns   "Turns into:"
    stop.browse  "Open the whole file in the spec browser ↓"
  binds
    color    the color prop is a token name such as "color.level.system", used as the CSS variable var(--color-level-system)
    props    number: integer, color: token name, depth: text, chip: text, reader: text, headline: text, explanation: text, lines: list of text, label: text, file: text, highlight: list of text, turnsInto: text, figure: a rendered view (an instance that the stop shows as it is, not the view to render), last?: boolean, browse?: text (the link's target)
  uses  Stack, CodeBlock
```
