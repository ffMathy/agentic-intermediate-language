# Button

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
