# Walk terminal

```ail
node WalkTerminal : view   level: experience
  why   The terminal is where a person meets the tools, so each chapter shows exactly what they print.   <- WalkthroughPlayer
  what
    a header naming where the commands run, then the given lines exactly, one per line, keeping every space; long lines wrap and are never cut off
    a line that starts with a prompt ("$ " or "> ") shows the prompt in the thread colour
    a line whose first visible mark is ✓, ✗, ! or ? is green, red, amber or yellow; the mark itself says what the line is, so colour is never the only sign
    when asked, a still block caret follows the last line; it never blinks
    with no lines, it says that nothing is printed in this chapter
    on a narrow screen the terminal keeps room for about six lines, so the parts under it move little while lines appear; side by side with the tree it stretches to the tree's height
    Scenario: lines kept exactly
      Given the place "terminal · examples/tictactoe" and the lines "$ ail build" and "✓ spec     no errors"
      Then the region named "Terminal output" shows exactly those two lines, each on its own line, with their spaces kept
      And the first line's prompt "$ " is a part of its own
    Scenario: the caret
      Given the lines "· App: deriving checks from its scenarios" and a caret
      Then exactly one caret is shown, after that line
    Scenario: nothing printed
      Given no lines
      Then "Nothing is printed in this chapter." is shown
  look
    root     a div: display flex, flex-direction column, height 100%, background color.code; holding [ head, body ]
    head     a p: margin 0, pad space.2 space.4, font.mono at font.tiny, color color.code.muted, a 1px solid color.code.border bottom border, overflow-wrap anywhere
    body     a div: flex 1 1 auto, min-height clamp(9em, 40vw, 320px), box-sizing border-box, pad space.3 space.4, font.mono at font.code, line-height 1.5, color color.code.text
    line     a div per line: margin 0, min-height 1.5em, white-space pre-wrap, overflow-wrap anywhere
    prompt   a span: color color.thread, weight 700
    marks    by the line's first non-space character: ✓ color color.dot.green, ✗ color color.dot.red, ! color color.dot.amber, ? color color.thread; any other line color.code.text
    caret    an aria-hidden span: display inline-block, width 0.6em, height 1.1em, margin-left 2px, vertical-align text-bottom, background color.thread; no animation
    empty    a p: margin 0, font.sans at font.small, font-style italic, color color.code.muted
  copy
    walk.term.label  "Terminal output"
    walk.term.empty  "Nothing is printed in this chapter."
  binds
    props    place: text, lines: list of text, caret: boolean
    body     role region with aria-label from walk.term.label
    prompt   a line that starts with "$ " or "> " is the span data-part "prompt" holding those two characters, then the rest of the line
    caret    the span data-part "caret", inside the last line, only when caret is true and there is a line
```
