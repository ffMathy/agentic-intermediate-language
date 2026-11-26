# Copy command

```ail
node CopyCommand : flow   level: experience
  why   Install commands get copied, so one press should copy them exactly.   <- Parts
  what
    shows one command on a dark row with a "Copy" button at its right end
    the whole command is always visible: a command too long for the row wraps onto further lines, breaking at spaces first and inside a word only when needed; it is never cut off or hidden behind a scroll
    the copied text is still the exact single-line command
    pressing "Copy" puts exactly the command on the clipboard; once that succeeds the button reads "Copied" for 1.5 seconds, then "Copy" again
    when the clipboard can't be written, the button keeps reading "Copy"
    Scenario: copying
      Given the command "ail build" and a working clipboard
      When the visitor presses the button named "Copy ail build"
      Then the clipboard holds "ail build"
      And the button reads "Copied"
      When 1500 ms pass
      Then the button reads "Copy" again
  look
    row      stack(h, gap: space.3, align: center, justify: between) with background color.code, radius.md, pad space.3, min-width 0
    command  a code element: font.mono at font.code, line-height 1.5, color.code.text, white-space pre-wrap, overflow-wrap anywhere, flex 1 1 auto, min-width 0
    button   font.sans at font.tiny, weight 600, color color.code.text, background transparent, a 1px solid color.code.border border, radius.sm, pad space.2 space.3, min-height 44px, cursor pointer, flex 0 0 auto
  copy
    copy.idle   "Copy"
    copy.done   "Copied"
    copy.name   "Copy {command}"
  binds
    props    command: text
    state    copied: boolean, starting at false
    press    navigator.clipboard.writeText(command); when it resolves, set copied to true; when it rejects or navigator.clipboard is missing, do nothing
    timer    while copied is true: after 1500 ms set copied to false; clear the timer in the effect's cleanup
    button   a native button with type "button" and aria-label from copy.name; its text is copy.done while copied, copy.idle otherwise
  uses  Stack
```
