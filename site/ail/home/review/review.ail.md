# Reviewing a change

What a pull request looks like when the spec changes. `ail build` writes the
code, the derived checks and the lock, and retakes the screens the change
touched. This repository's `.gitattributes` marks what the build writes as
generated, so GitHub collapses it, and the screenshots sit beside the spec.
A reviewer reads two things: the spec, and the screens.

The sample is a real change to the Tic-Tac-Toe demo: the "Watch again"
button. Its screens are the demo's committed screenshots, from the spec
module, so they are always the current ones.

More nodes in this folder, each in a file of its own: [`SamplePullRequest`](sample-pull-request.ail.md), [`PullRequestDiff`](pull-request-diff.ail.md).

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
