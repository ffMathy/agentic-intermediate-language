# Spec shot

A proof screenshot, shown where the spec editor would show a file: the image
on the dark code panel, with the node and the check it proves under it.

```ail
node SpecShot : view   level: experience
  why   A screenshot is part of what a spec folder holds, so it is shown in the same panel as the spec files, said to be the proof of one check.   <- Parts
  what
    shows the screenshot as large as fits, without cropping or stretching, with the node's name and the check it ends under it
    Scenario: a screenshot is shown
      Given the node "BoardView", the test "a win", the path "board/shots/board-view/01-a-win.png" and an image source
      Then the region named "Screenshot board/shots/board-view/01-a-win.png" shows the image named "Screenshot at the end of the check “a win”"
      And it contains "BoardView"
  look
    shot      a figure with role region named by shot.region: margin 0, height 100%, box-sizing border-box, display flex, flex-direction column, gap space.2, align-items center, justify-content center, pad space.4, background color.code; holding [ image, caption ]
    image     an img: display block, max-width 100%, min-height 0, flex 1 1 auto, object-fit contain, radius.md, a 1px solid color.code.border border, background color.surface
    caption   a figcaption: font.tiny, color color.code.muted, text-align center; the node's name in font.mono and color color.code.text, then shot.caption with {test} filled in
  copy
    shot.region   "Screenshot {path}"
    shot.alt      "Screenshot at the end of the check “{test}”"
    shot.caption  " · the screen at the end of the check “{test}”"
  binds
    props     node: text, test: text, path: text, src: text
    region    shot.region with {path} filled in
    img       src the given src; alt from shot.alt with {test} filled in
```
