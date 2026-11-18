```ail
node TallyPanel : flow   level: experience
  why   Let a host count guests at the door without losing track.   <- Venue
  what
    Scenario: counting a guest
      Given the tally shows 0
      When the host presses "Add guest"
      Then the tally shows 1
    Scenario: starting over
      Given the tally shows 4
      When the host presses "Reset"
      Then the tally shows 0
  look
    layout   stack(v, gap: space.4, align: center, pad: space.6) [ Text.title tally, Button.primary.lg add, Button.secondary reset ]
  copy
    tally.add    "Add guest"
    tally.reset  "Reset"
  binds
    state   useReducer(tally, 0)
    add     dispatch increment
    reset   dispatch reset
  uses  Tally
```
