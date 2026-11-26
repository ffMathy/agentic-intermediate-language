# Sample pull request

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
