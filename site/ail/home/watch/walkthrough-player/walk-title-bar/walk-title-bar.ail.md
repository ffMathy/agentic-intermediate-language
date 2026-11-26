# The player's parts

The terminal, the spec tree, the chapter's inset, the controls and the row of
chapters. They only show what the player hands them; the player alone keeps
state and runs the timer.

More nodes, each in a folder of its own: [`WalkCaption`](../walk-caption/walk-caption.ail.md), [`WalkTerminal`](../walk-terminal/walk-terminal.ail.md), [`WalkPicture`](../walk-picture/walk-picture.ail.md), [`WalkInset`](../walk-picture/walk-inset/walk-inset.ail.md), [`WalkControls`](../walk-controls/walk-controls.ail.md), [`WalkTimeline`](../walk-timeline/walk-timeline.ail.md).

```ail
node WalkTitleBar : view   level: experience
  why   The player looks like a terminal window, with the two walkthroughs as its tabs and the time at its right end.   <- WalkthroughPlayer
  what
    three window dots, the tabs "ail build" and "ail adopt", then the time played and the total time
    the left and right arrow keys move between the two tabs, and move focus with them
    Scenario: the tabs
      Given the tab "build" and the times "0:06" and "1:25"
      Then the tablist named "Walkthroughs" has the tabs "ail build" and "ail adopt", in that order, and only "ail build" is selected
      And "0:06 / 1:25" is shown
    Scenario: arrow keys
      Given the tab "build", with the tab "ail build" focused
      When the visitor presses the right arrow key
      Then the bar asks for the tab "adopt", once, and the tab "ail adopt" has focus
  look
    bar      a div: display flex, flex-wrap wrap, align-items center, gap space.3, pad space.1 space.3, background color.code.bar, a 1px solid color.code.border bottom border; holding [ dots, tabs, time ]
    dots     an aria-hidden div with three 10px circles 6px apart: color.dot.red, color.dot.amber, color.dot.green
    tabs     a div with role tablist: display flex, gap space.1
    tab      a native button with type "button": height 44px, pad 0 space.3, radius.md, border none, font.mono at font.small, weight 600, cursor pointer; the picked tab has background color.code.pick and color color.code.text, the other background transparent and color color.code.muted
    time     a p: margin 0 0 0 auto, font.mono at font.small, color color.code.muted; now in a span with color color.code.text, then the rest of walk.time
  copy
    walk.tabs        "Walkthroughs"
    walk.tab.build   "ail build"
    walk.tab.adopt   "ail adopt"
    walk.time        "{now} / {total}"
  binds
    props    tab: "build" | "adopt", now: text, total: text, onPick(tab: "build" | "adopt")
    tablist  aria-label from walk.tabs
    time     never in a live region
    tab      role tab, id "walk-tab-{key}", aria-selected, aria-controls "walk-panel", tabIndex 0 when picked and -1 otherwise; a click calls onPick with its key; ArrowRight and ArrowLeft call onPick with the other key (with two tabs both wrap) and focus that tab
```
