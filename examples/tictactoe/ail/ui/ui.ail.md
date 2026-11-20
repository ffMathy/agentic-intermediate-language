# UI kit

The few building blocks every screen is made of. They are ordinary nodes,
specified and compiled like the rest of the game. Only the variants the game
actually uses exist.

```ail
node UiKit : library   level: experience
  why   Every screen is built from the same few parts, so the game looks consistent everywhere.   <- TicTacToe
  children  Stack, Text, Button, Segmented
```

```ail
node Stack : view   level: experience
  why   Every screen is a column or a row of parts with even spacing.   <- UiKit
  what
    lays out its children in a column or a row, in the order given, with an even gap between them
    Scenario: children keep their order
      Given the children "a", "b" and "c"
      Then they appear in that order
  look
    box     a flex box: a column when dir is "v", a row when dir is "h"
    gap     the given token, as a CSS variable
    align   cross-axis alignment: start → flex-start, center → center, end → flex-end; stretch otherwise
    pad     the given token on all sides; no padding when none is given
  binds
    props   dir: "v" | "h", gap?: token name, align?: "start" | "center" | "end" | "stretch", pad?: token name, style?: extra inline style, children
    element a div
```

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

```ail
node Button : view   level: experience
  why   Every action looks and behaves like an action.   <- UiKit
  what
    a native button that runs its action once each time it is pressed
    Scenario: pressing
      Given a button showing "New game"
      When it is pressed
      Then its action runs once
  look
    shape      radius.md, pad space.2 above and below and space.4 left and right, font.body, weight 600, the page's font family, a pointer cursor
    primary    background color.action, text color.action.text, a 1px color.action border
    secondary  background color.surface, text color.text, a 1px color.border border
  binds
    props      variant: "primary" | "secondary", onPress(), children
    element    a button with type "button"
```

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
    group    the full width of its container; a 1px color.border border, radius.md, pad space.1, gap space.1, background color.surface.raised
    option   equal widths; pad space.2 above and below and space.4 left and right; radius.md; no border; a pointer cursor; the page's font
    picked   background color.surface, text color.text, weight 600
    other    a transparent background, text color.text.muted, weight 400
  binds
    props    label: text, options: list of { value: text, label: text }, value: text, onChange(value: text)
    element  a div with role radiogroup named by label; each option a button with type "button", role radio and aria-checked
```
