# Review note

```ail
node ReviewNote : view   level: experience
  why   Generated code is committed but not reviewed: show how to keep it out of pull request diffs.   <- GetStarted
  what
    a heading, why generated code is committed but collapsed in review, and the .gitattributes lines that do it
    Scenario: generated code stays out of review
      Given the note is shown
      Then the region named "Review the spec, not the generated code" shows the lines "src/gen/** linguist-generated=true" and "ail.lock.json linguist-generated=true"
  look
    note      a section element named by its h3 (aria-labelledby): background color.surface.raised, radius.lg, pad clamp(16px, 4vw, 24px), min-width 0; stack(v, gap: space.3, align: stretch) [ title, text, code ]
    title     an h3: font.lead, weight 700, color.text, margin 0
    text      a p: font.body, line-height 1.6, color.text.muted, max-width width.prose, margin 0
    code      CodeBlock with lines review.line.1 to review.line.3, label review.label
  copy
    review.title   "Review the spec, not the generated code"
    review.text    "Commit what ail build generates, so the app runs straight from the repository and CI can prove it was built from the spec. Then mark it as generated, and GitHub collapses it in every pull request diff: reviewers read the spec, the checks and the proof screenshots instead."
    review.label   ".gitattributes"
    review.line.1  "# .gitattributes, at the root of the repository"
    review.line.2  "src/gen/** linguist-generated=true"
    review.line.3  "ail.lock.json linguist-generated=true"
  uses  Stack, CodeBlock
```
