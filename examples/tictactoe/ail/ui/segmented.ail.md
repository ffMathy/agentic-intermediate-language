# Segmented

```ail
node Segmented : view   level: experience
  why   Picking one of a few options takes one tap and always shows what is picked.   <- UiKit
  what
    a group of options with exactly one picked, named with its label
    picking an option asks for that option's value; what shows as picked follows the value it is given
    Scenario: picking another option
      Given the options "Friend" and "Computer", with "Friend" picked
      When "Computer" is picked
      Then the value of "Computer" is asked for, once
      And "Friend" still shows as picked
  look
    group    exactly the full width of its container, border and padding included (border-box sizing); a 1px color.border border, radius.md, pad space.1, gap space.1, background color.surface.raised
    option   equal widths; pad space.2 above and below and space.4 left and right; radius.md; no border; a pointer cursor; the page's font
    picked   background color.surface, text color.text, weight 600
    other    a transparent background, text color.text.muted, weight 400
  binds
    props    label: text, options: list of { value: V, label: text }, value: V, onChange(value: V), where V is any choice of texts (such as Opponent), the same for all three
    element  a div with role radiogroup named by label; each option a button with type "button", role radio and aria-checked
```
