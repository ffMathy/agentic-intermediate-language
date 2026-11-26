# Reviewing a change

What a pull request looks like when the spec changes. `ail build` writes the
code, the derived checks and the lock, and retakes the screens the change
touched. This repository's `.gitattributes` marks what the build writes as
generated, so GitHub collapses it, and the screenshots sit beside the spec.
A reviewer reads two things: the spec, and the screens.

The sample is a real change to the Tic-Tac-Toe demo: the "Watch again"
button. Its screens are the demo's committed screenshots, from the spec
module, so they are always the current ones.

```ail
node ReviewSection : view   level: experience
  why   The point of AIL is a review people can do: show that a change to the spec is reviewed by reading the spec and looking at the screens, and nothing else.   <- HomePage
  what
    the section has the id "review", so the page can link to it
    a heading, a sample pull request, and a note on why it reads that way
    Scenario: what a reviewer reads
      Given the page is open
      Then the section with the id "review" has the level 2 heading "Review the spec and the screens. That's all."
      And it has a region named "Sample pull request"
  look
    band      Section with id "review", tone plain
    layout    stack(v, gap: space.6, align: stretch) [ head, SamplePullRequest, note ]
    head      SectionHeading with eyebrow from reviewing.eyebrow, text from reviewing.heading, lead from reviewing.lead
    note      a p: font.small, line-height 1.6, color.text.muted, max-width width.prose, margin 0
  copy
    reviewing.eyebrow  "REVIEWING A CHANGE"
    reviewing.heading  "Review the spec and the screens. That's all."
    reviewing.lead     "When the spec changes, ail build writes the code, the checks and the lock, and retakes every screen the change touched. In the pull request, what the build wrote is committed but collapsed. What is left to read is what the spec now says, and what the app now looks like, side by side in the same folder."
    reviewing.note     "This is how pull requests in this repository read: .gitattributes marks what ail build writes as generated, so GitHub collapses it, and ail show checks puts every test, with the screen it ends on, into the description. The code is still there, one click away, and the checks have already proven it does what the spec says."
  uses      Section, SectionHeading, Stack, SamplePullRequest
  children  SamplePullRequest
```

```ail
node SamplePullRequest : view   level: experience
  why   Make the claim concrete: one pull request, where the parts to review are open and everything the build wrote is folded away.   <- ReviewSection
  what
    a pull request for one spec change to the demo, in the shape GitHub shows it: a title, a summary of the files, then the files
    the files to review are open: the spec file's diff (PullRequestDiff), then the two screens the change touched, each with its file name and the check it ends
    the files ail build wrote are listed after them, collapsed: only their paths and that they are generated show, never their contents
    a screen that is missing from the spec module is left out
    Scenario: the parts to review are open
      Given the section is shown
      Then the region named "Sample pull request" contains "examples/tictactoe/ail/app/demo/demo.ail.md"
      And it contains "+    Scenario: watch again"
      And it shows the images named "Screenshot at the end of the check “perfect play ends in a draw”" and "Screenshot at the end of the check “watch again”", in that order
    Scenario: what the build wrote is collapsed
      Given the section is shown
      Then the region named "Sample pull request" contains "examples/tictactoe/src/gen/app/demo/watch-a-demo.tsx", "examples/tictactoe/checks/app/demo/watch-a-demo.test.tsx" and "examples/tictactoe/ail.lock.json"
      And none of their contents is shown
  look
    window     a div with role region named by pr.label: background color.surface, a 1px solid color.border border, radius.lg, overflow hidden, box-shadow 0 12px 32px rgba(42, 26, 14, 0.10)
    layout     stack(v, gap: 0, align: stretch) [ header, summary, files ]
    header     a div: pad space.4 clamp(16px, 4vw, 24px), a 1px solid color.border bottom border; holding [ title, meta ]
    title      an h3: margin 0, font.lead, weight 700, color.text
    meta       a p: margin space.1 0 0 0, font.small, color.text.muted; the open badge first: a span, display inline-block, pad 2px space.2, radius.pill, background color.pass, color color.on.accent, font.tiny, weight 700, margin-right space.2
    summary    a div: display flex, flex-wrap wrap, gap space.2, pad space.3 clamp(16px, 4vw, 24px), background color.surface.raised, a 1px solid color.border bottom border; holding [ toread, folded ]
    toread     a span: pad space.1 space.3, radius.pill, font.small, weight 700, background color.accent, color color.on.accent
    folded     a span: pad space.1 space.3, radius.pill, font.small, weight 600, background color.surface, color color.text.muted, a 1px solid color.border border
    files      stack(v, gap: space.3, align: stretch, pad: space.3) [ PullRequestDiff, screens, generated ]
    file       a div: a 1px solid color.border border, radius.md, overflow hidden, background color.surface, min-width 0
    filebar    a div: display flex, flex-wrap wrap, align-items center, gap space.2, pad space.2 space.3, background color.surface.raised, a 1px solid color.border bottom border; the path in font.mono at font.tiny, color.text, overflow-wrap anywhere, flex 1 1 200px; then the tag
    tag        a span: pad 2px space.2, radius.pill, font.micro, weight 700, letter-spacing 0.04em, background color.step.check, color color.on.accent
    shots      a div: display grid, grid-template-columns repeat(auto-fit, minmax(min(220px, 100%), 1fr)), gap space.3, pad space.3
    shot       a figure: margin 0, display flex, flex-direction column, gap space.1, min-width 0
    frame      an img: display block, width 100%, height auto, box-sizing border-box, background color.surface, a 1px solid color.border border, radius.md
    caption    a figcaption: font.tiny, color.text.muted, overflow-wrap anywhere; the file name in font.mono, then on the next line the check mark in color.pass, weight 700, one space, and the check's name in quotes
    generated  stack(v, gap: 0, align: stretch) [ row, row, row ] inside a div with a 1px solid color.border border, radius.md, overflow hidden
    row        a div: display flex, flex-wrap wrap, align-items center, gap space.2, pad space.2 space.3, background color.surface.raised, font.tiny; rows after the first have a 1px solid color.border top border; the path in font.mono, color color.text.muted, overflow-wrap anywhere, flex 1 1 220px; then pr.generated in color.text.muted; then pr.load: color color.accent, weight 600, underline
  copy
    pr.label        "Sample pull request"
    pr.title        "Let viewers watch the demo again"
    pr.open         "Open"
    pr.meta         "wants to merge 1 commit into main · examples/tictactoe"
    pr.toread       "To review: 1 spec file, 2 screens"
    pr.folded       "Collapsed: 3 files written by ail build"
    pr.shots.tag    "screens"
    pr.shots.root   "examples/tictactoe/ail/"
    pr.shot.alt     "Screenshot at the end of the check “{test}”"
    pr.shot.mark    "✓"
    pr.gen.1        "examples/tictactoe/src/gen/app/demo/watch-a-demo.tsx"
    pr.gen.2        "examples/tictactoe/checks/app/demo/watch-a-demo.test.tsx"
    pr.gen.3        "examples/tictactoe/ail.lock.json"
    pr.generated    "Generated files are not rendered by default."
    pr.load         "Load diff"
  binds
    header     the h3 shows pr.title; the meta p shows the badge pr.open, then pr.meta
    data       specProjects from the spec module: of the project with key "tictactoe", the shots of node "WatchADemo" whose test is "perfect play ends in a draw", then the one whose test is "watch again"; a missing one is left out
    screens    a file whose bar shows pr.shots.root followed by the folder of the first shot's path (its path up to the last "/", with that "/"), and the tag pr.shots.tag; then the shots grid with one figure per shot
    img        src the shot's src; alt from pr.shot.alt with {test} filled in
    caption    the shot's file name (its path after the last "/"), then pr.shot.mark, one space, then “ + the shot's test + ”
    generated  one row per path pr.gen.1 to pr.gen.3, in order; "Load diff" is plain text, not a link or button: the sample has no diff to load
  uses     Stack, PullRequestDiff
  children PullRequestDiff
```

```ail
node PullRequestDiff : view   level: experience
  why   The spec is the first thing a reviewer reads: show the change to it as a diff, the way a pull request shows any file.   <- SamplePullRequest
  what
    the demo's spec file, with the lines the change added, removed and kept around them, each kind marked
    Scenario: the spec change
      Given the diff is shown
      Then it shows "examples/tictactoe/ail/app/demo/demo.ail.md"
      And it shows the line "+    Scenario: watch again"
      And it shows the line "-    layout   stack(v, gap: space.4, align: center) [ StatusLine, BoardView ]"
  look
    file       a div: a 1px solid color.border border, radius.md, overflow hidden, background color.surface, min-width 0
    filebar    a div: display flex, flex-wrap wrap, align-items center, gap space.2, pad space.2 space.3, background color.surface.raised, a 1px solid color.border bottom border; the path in font.mono at font.tiny, color.text, overflow-wrap anywhere, flex 1 1 200px; then the tag
    tag        a span: pad 2px space.2, radius.pill, font.micro, weight 700, letter-spacing 0.04em, background color.level.product, color color.on.accent
    diff       a pre: margin 0, overflow-x auto, font.mono at font.tiny, line-height 1.7, color color.text; each line a div with white-space pre, pad 0 space.3, min-width max-content
    added      background rgba(21, 128, 61, 0.12); the leading "+" in color.pass, weight 700
    removed    background rgba(220, 38, 38, 0.10); the leading "-" in color.player.o, weight 700
    hunk       background color.accent.soft, color color.text.muted
  copy
    pr.spec.path    "examples/tictactoe/ail/app/demo/demo.ail.md"
    pr.spec.tag     "spec"
    pr.diff.1       "@@ node WatchADemo : flow   level: experience"
    pr.diff.2       "     the board can't be picked during the demo"
    pr.diff.3       "+    "Watch again" appears once the demo has ended"
    pr.diff.4       "@@ Scenario: perfect play ends in a draw"
    pr.diff.5       "       Then the status says "It's a draw""
    pr.diff.6       "+      And "Watch again" is shown"
    pr.diff.7       "+    Scenario: watch again"
    pr.diff.8       "+      Given the demo has ended"
    pr.diff.9       "+      When the viewer presses "Watch again""
    pr.diff.10      "+      Then the board is empty, the status says "X's turn", and "Watch again" is gone"
    pr.diff.11      "@@ look"
    pr.diff.12      "-    layout   stack(v, gap: space.4, align: center) [ StatusLine, BoardView ]"
    pr.diff.13      "+    layout   stack(v, gap: space.4, align: center) [ StatusLine, BoardView, again ]"
    pr.diff.14      "+    again    Button.secondary, only once the demo has ended"
    pr.diff.15      "+  copy"
    pr.diff.16      "+    demo.again  "Watch again""
  binds
    diff       the lines pr.diff.1 to pr.diff.16, in order
    lines      a diff line's first character says what it is: "@" a hunk, "+" added, "-" removed, anything else unchanged; the line is shown whole, its first character included
```
