# Watch it work

Two short walkthroughs of the real tools on the Tic-Tac-Toe demo: `ail build`
compiling a small spec change into checked code, and `ail adopt` bringing an
old app under a spec. Nothing moves until the visitor presses Play. The
contents of the walkthroughs are data, in [`walkthrough/`](walkthrough/); the
pieces of the player are in [`stage.ail.md`](stage.ail.md).

More nodes in this folder, each in a file of its own: [`WalkthroughPlayer`](walkthrough-player.ail.md).

```ail
node WatchSection : view   level: experience
  why   Reading about a build is not the same as seeing one: show ail build and ail adopt at work on the real demo, at the visitor's own pace.   <- HomePage
  what
    the section has the id "watch", so the page can link to it
    an eyebrow, a heading and one sentence on what the two walkthroughs show, then the walkthrough player
    Scenario: the section
      Given the page is open
      Then the section with the id "watch" has the level 2 heading "Watch AIL build, and adopt"
      And "SEE IT RUN" is shown above the heading
  look
    band    Section with id "watch", tone raised
    layout  the band holds [ head, WalkthroughPlayer ], with the band's own gap between them
    head    SectionHeading with eyebrow from watch.eyebrow, text from watch.heading, lead from watch.lead
  copy
    watch.eyebrow  "SEE IT RUN"
    watch.heading  "Watch AIL build, and adopt"
    watch.lead     "Two short walkthroughs you can pause on any chapter: a spec change built into checked code, and an old app described by a spec and proven against it."
  uses      Section, SectionHeading, WalkthroughPlayer
  children  WalkthroughPlayer
```
