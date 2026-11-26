# Text

```ail
node Text : view   level: experience
  why   Text that plays the same role looks the same everywhere.   <- UiKit
  what
    shows its content as a block, in the status, mark or body style
    can be announced to screen readers when it changes
    Scenario: content is shown
      Given the content "X wins!" in the status style
      Then exactly that text is shown
  look
    status  font.status, weight 600, color.text
    mark    font.mark, weight 800, line height 1
    body    font.body, color.text
    color   when given, that color token replaces the style's color
    align   start or center, when given
  binds
    props   variant: "status" | "mark" | "body", color?: token name, align?: "start" | "center", live?: "polite", children
    element a span shown as a block, with aria-live set to live
```
