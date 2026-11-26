# Stack

```ail
node Stack : view   level: experience
  why   Most of the page is a column or a row of parts with even spacing.   <- Parts
  what
    lays out its children in a column or a row, in the order given, with an even gap between them
    a row can wrap onto more lines when it runs out of room
    Scenario: children keep their order
      Given the children "a", "b" and "c"
      Then they appear in that order
  look
    box      a flex box: a column when dir is "v", a row when dir is "h"
    gap      the given token, as a CSS variable
    align    cross-axis alignment: start → flex-start, center → center, end → flex-end; stretch otherwise
    justify  main-axis alignment: start → flex-start, center → center, between → space-between; flex-start otherwise
    wrap     flex-wrap wrap when wrap is true; nowrap otherwise
    pad      the given token on all sides; no padding when none is given
  binds
    props    dir: "v" | "h", gap?: token name, align?: "start" | "center" | "end" | "stretch", justify?: "start" | "center" | "between", wrap?: boolean, pad?: token name, style?: extra inline style, children
    element  a div
```
