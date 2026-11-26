# Walk timeline

```ail
node WalkTimeline : view   level: experience
  why   A visitor should see how long each chapter is and where they are, and reach any chapter in one press.   <- WalkthroughPlayer
  what
    one button per chapter in a row, each as wide as its share of the walkthrough's time
    the chapters before the current one are filled, and the current one as far as it has played
    a branch chapter has a dashed bar, so it reads as a detour from the main path
    at 600px viewport width or more, each chapter's title is shown under its bar
    Scenario: the chapters
      Given the chapters "One" of 6 seconds, "Two" of 9 seconds and "Three" of 9 seconds, with "Two" current and half played
      Then the list named "Chapters" has the buttons "Chapter 1: One", "Chapter 2: Two" and "Chapter 3: Three", in that order
      And only "Chapter 2: Two" is the current step
    Scenario: picking a chapter
      Given the chapters "One", "Two" and "Three"
      When the visitor presses "Chapter 3: Three"
      Then the timeline asks for the third chapter, once
  look
    list     an ol: list-style none, margin 0, pad 0, display flex, gap space.1, align-items flex-start
    item     an li per chapter: flex-grow its seconds, flex-shrink 1, flex-basis 0, min-width 0
    button   a native button with type "button": display flex, flex-direction column, justify-content center, gap space.1, width 100%, min-height 44px, pad space.1 0, margin 0, border none, background transparent, text-align left, cursor pointer
    bar      a span: display block, height 8px, box-sizing border-box, radius.pill, overflow hidden, background color.code.pick, a 1px solid color.code.muted border; a branch chapter's bar instead has background transparent and a 1.5px dashed color.code.muted border
    fill     a span inside the bar: display block, height 100%, radius.pill, background color.thread; width 100% before the current chapter, the played share for the current one, 0% after it
    title    a span with class "ail-wide": display block, font.sans at font.tiny, line-height 1.3, color color.code.muted, overflow-wrap anywhere; the current chapter's title has weight 700 and color color.code.text
  copy
    walk.chapters  "Chapters"
    walk.chapter   "Chapter {n}: {title}"
  binds
    props    beats: list of Beat, chapter: integer, played: number, onPick(chapter: integer)
    list     aria-label from walk.chapters
    button   aria-label from walk.chapter with n = its index + 1 and the beat's title; aria-current "step" on the current chapter only; pressing it calls onPick with its index
    fill     played is a share from 0 to 1 of the current chapter
  uses      Walkthrough
```
