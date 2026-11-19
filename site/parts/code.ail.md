# Code panels

Spec excerpts, generated code and commands are read and copied, so they are
shown exactly and stay legible on a phone.

```ail
node CodeBlock : view   level: experience
  why   Spec excerpts and code must be shown exactly, with the followed promise easy to spot.   <- Parts
  what
    shows the given lines exactly, one per line, keeping every space; an empty line stays an empty line
    is a region named with the given label, so screen readers can announce it
    long lines scroll sideways instead of wrapping
    every occurrence of each highlight phrase is marked, in every line
    a caption, when given, is shown under the block
    Scenario: shown exactly
      Given the lines "a  b" and "  c" and the label "Sample"
      Then the region named "Sample" contains exactly those two lines, joined by a line break
    Scenario: the thread is marked
      Given the lines "4. The computer never loses." and "5. New game" and the highlight "never loses"
      Then exactly one marked piece of text is shown, and it reads "never loses"
    Scenario: a caption
      Given the caption "examples/tictactoe/tictactoe.ail.md"
      Then that text is shown under the block
  look
    layout   stack(v, gap: space.2, align: stretch) [ block, caption ]
    block    a pre element: background color.code, text color.code.text, font.mono at font.code, line-height 1.6, pad space.4, radius.md, margin 0, overflow-x auto, white-space pre
    edge     when edge is given, a 4px solid left border in that color token
    mark     a mark element: background color.thread.soft, color color.thread, a 1px solid color.thread bottom border, pad 0 2px, radius 2px
    caption  font.mono at font.tiny, color.text.muted, overflow-wrap anywhere
  binds
    props    lines: string[], label: string, edge?: token name, highlight?: string[], caption?: string
    element  the pre has role region and aria-label set to label; lines are joined with line breaks inside it
  uses  Stack
```

```ail
node CopyCommand : flow   level: experience
  why   Install commands get copied, so one press should copy them exactly.   <- Parts
  what
    shows one command on a dark row with a "Copy" button at its right end
    pressing "Copy" puts exactly the command on the clipboard; once that succeeds the button reads "Copied" for 1.5 seconds, then "Copy" again
    when the clipboard can't be written, the button keeps reading "Copy"
    Scenario: copying
      Given the command "ail check" and a working clipboard
      When the visitor presses the button named "Copy ail check"
      Then the clipboard holds "ail check"
      And the button reads "Copied"
      When 1500 ms pass
      Then the button reads "Copy" again
  look
    row      stack(h, gap: space.3, align: center, justify: between) with background color.code, radius.md, pad space.3, min-width 0
    command  a code element: font.mono at font.code, color.code.text, white-space pre, overflow-x auto, flex 1 1 auto, min-width 0
    button   font.sans at font.tiny, weight 600, color color.code.text, background transparent, a 1px solid color.code.border border, radius.sm, pad space.1 space.3, cursor pointer, flex 0 0 auto
  copy
    copy.idle   "Copy"
    copy.done   "Copied"
    copy.name   "Copy {command}"
  binds
    props    command: string
    state    useState(false) for copied
    press    navigator.clipboard.writeText(command); when it resolves, set copied to true; when it rejects or navigator.clipboard is missing, do nothing
    timer    while copied is true: after 1500 ms set copied to false; clear the timer in the effect's cleanup
    button   a native button with type "button" and aria-label from copy.name; its text is copy.done while copied, copy.idle otherwise
  uses  Stack
```
