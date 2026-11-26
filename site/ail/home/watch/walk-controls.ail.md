# Walk controls

```ail
node WalkControls : view   level: experience
  why   Moving through a walkthrough takes one press: back a chapter, play or pause, or on a chapter.   <- WalkthroughPlayer
  what
    three buttons on one row: Previous, the play button and Next, named "Previous chapter" and "Next chapter"
    the play button reads "Play", "Pause" or "Replay", as the player says
    "Previous chapter" is disabled on the first chapter, and "Next chapter" on the last
    Scenario: on the first chapter
      Given the play button reads "Play" on the first of several chapters
      Then the buttons "Previous chapter", "Play" and "Next chapter" are shown, in that order
      And "Previous chapter" is disabled and "Next chapter" is not
    Scenario: moving on
      Given the play button reads "Pause" on a middle chapter
      When the visitor presses "Next chapter"
      Then the controls ask for the next chapter, once
  look
    row       a div: display flex, align-items center, gap space.2, pad space.3 space.4; holding [ previous, play, next ]
    button    previous and next: native buttons with type "button": flex 1 1 0, min-width 0, max-width 160px, height 44px, pad 0 space.2, radius.md, a 1px solid color.code.border border, background transparent, color color.code.text, font.sans at font.small, weight 600, cursor pointer
    play      a native button with type "button": flex 1 1 0, min-width 0, max-width 160px, height 44px, pad 0 space.2, radius.md, a 1px solid color.thread border, background color.thread, color color.code, font.sans at font.small, weight 700, cursor pointer
    disabled  a disabled button has opacity 0.4 and cursor default
  copy
    walk.previous  "Previous chapter"
    walk.next      "Next chapter"
    walk.previous.short  "Previous"
    walk.next.short      "Next"
    walk.play      "Play"
    walk.pause     "Pause"
    walk.replay    "Replay"
  binds
    props    mode: "play" | "pause" | "replay", first: boolean, last: boolean, onPrevious(), onPlay(), onNext()
    buttons  native buttons; previous shows walk.previous.short with aria-label walk.previous; next shows walk.next.short with aria-label walk.next; the play button has id "walk-play"; previous is disabled when first is true, next when last is true; play shows walk.play, walk.pause or walk.replay for its mode
```
