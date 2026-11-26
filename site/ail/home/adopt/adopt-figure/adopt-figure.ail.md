# Adopt figure

```ail
node AdoptFigure : view   level: experience
  why   Show the whole idea at a glance: one spec in the middle, proved against the old app and then against the new one.   <- AdoptSection
  what
    three boxes in a row, "Your app today", "AIL spec" and "Your app, rebuilt", joined by arrows; the spec box in the middle is dark like the code panels, and under the row a line says the same checks pass on both
    below 600px viewport width the three boxes are stacked in a column, joined by downward arrows, so every label stays readable on a phone
    Scenario: the picture
      Given the section is shown
      Then an image named "An existing app is described by an AIL spec, which builds a new app; the same checks pass on both" is shown
      And it contains the texts "Your app today", "AIL spec" and "Your app, rebuilt"
  look
    svg       class "ail-wide" (shown only at 600px viewport width or more); viewBox 0 0 960 240, width 100%, height auto, display block
    boxes     rects y 40 width 240 height 120 rx 12: x 20 fill color.surface, stroke color.border, stroke-width 2; x 360 fill color.code; x 700 fill color.surface, stroke color.border, stroke-width 2
    titles    text-anchor middle, font-size 20, weight 700, at y 92: "Your app today" at x 140 fill color.text; "AIL spec" at x 480 fill color.thread, font.display; "Your app, rebuilt" at x 820 fill color.text
    subs      text-anchor middle, font-size 14, at y 122: "any stack" at x 140 fill color.text.muted; "why · what · how" at x 480 fill color.code.text; "any stack" at x 820 fill color.text.muted
    arrows    two lines, stroke color.accent, stroke-width 3: 268,100 to 350,100 and 608,100 to 690,100; each ends in a path, fill color.accent: "M340 92 L354 100 L340 108 Z" and "M680 92 L694 100 L680 108 Z"
    labels    text-anchor middle, font-size 13, weight 600, fill color.accent, at y 84: "adopt" at x 309; "build" at x 649
    checks    a path "M140 160 V196 H820 V160", fill none, stroke color.pass, stroke-width 2, stroke-dasharray 6 6
    pass      a rect x 330 y 182 width 300 height 30 rx 15 fill color.pass; on it, text at 480, 202, text-anchor middle, font-size 14, weight 700, fill color.on.accent
    stacked   a second svg with class "ail-narrow" (shown only below 600px viewport width): viewBox 0 0 300 432, width 100%, max-width 340px, height auto, margin 0 auto. Three rects x 40 width 220 height 72 rx 12 at y 4, 154 and 304: the first and third fill color.surface, stroke color.border, stroke-width 2; the middle one fill color.code. Each box's title is at x 150, the rect's y + 32, text-anchor middle, font-size 17, weight 700, and its sub at x 150, the rect's y + 54, text-anchor middle, font-size 13, with the same texts, fills and fonts as titles and subs. Two arrows, stroke color.accent, stroke-width 3: lines 150,84 to 150,140 and 150,234 to 150,290, each ending in a path filled color.accent: "M142 132 L150 146 L158 132 Z" and "M142 282 L150 296 L158 282 Z". The labels "adopt" and "build" are at x 162, y 116 and y 266, text-anchor start, font-size 13, weight 600, fill color.accent. The checks are a path "M40 40 H18 V340 H40", fill none, stroke color.pass, stroke-width 2, stroke-dasharray 6 6. The pass is a rect x 10 y 396 width 280 height 32 rx 16 fill color.pass, with adopt.figure.pass on it at 150, 417, text-anchor middle, font-size 14, weight 700, fill color.on.accent
  copy
    adopt.figure.label  "An existing app is described by an AIL spec, which builds a new app; the same checks pass on both"
    adopt.figure.pass   "✓ the same checks pass on both"
  binds
    svg       svg and stacked each have role img with aria-label from adopt.figure.label; they are switched only by their classes "ail-wide" and "ail-narrow", and the wide svg comes first in the DOM
```
