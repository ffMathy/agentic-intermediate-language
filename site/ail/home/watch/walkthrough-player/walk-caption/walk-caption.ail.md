# Walk caption

```ail
node WalkCaption : view   level: experience
  why   Every chapter says where it is in the walkthrough, what it is called and what it shows, in plain words.   <- WalkthroughPlayer
  what
    the chapter's number out of all of them, its title as a level 3 heading, then its caption; a branch chapter says that it is a branch off the main path
    Scenario: a branch chapter
      Given chapter 7 of 10, a branch, titled "Branch: the spec must decide" with the caption "Suppose only what had changed."
      Then "Chapter 7 of 10 · a branch off the main path" is shown
      And the level 3 heading reads "Branch: the spec must decide", with "Suppose only what had changed." under it
  look
    strip    a div: display flex, flex-direction column, gap space.1, pad space.3 space.4, background color.code.bar, a 1px solid color.code.border bottom border; holding [ count, title, caption ]
    count    a p: margin 0, font.mono at font.tiny, color color.code.muted
    title    an h3: margin 0, font.sans at font.body, weight 700, line-height 1.4, color color.code.text
    caption  a p: margin 0, font.small, line-height 1.6, color color.code.text, max-width width.prose
  copy
    walk.count   "Chapter {n} of {count}"
    walk.branch  "Chapter {n} of {count} · a branch off the main path"
  binds
    props    n: integer, count: integer, branch: boolean, title: text, caption: text
    count    walk.branch when branch is true, otherwise walk.count
    strip    aria-live "polite" and aria-atomic "true", so a chapter that changes while playing is announced
```
