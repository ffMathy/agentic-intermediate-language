# This page

The page shows its own spec. The files are not copied into the spec by hand:
`ail build` writes them into a data module (the project's `specModule`), so
what the visitor reads is always the spec this page was built from.

```ail
node ThisPage : flow   level: experience
  why   The best evidence is the page you are reading: it is written in AIL and built by the same tool.   <- HomePage
  what
    a heading, one sentence, how big this page's spec is, a list of its spec files, and the source of the picked file
    the size is counted from the spec itself: the number of nodes and the number of files
    the files are listed by path, in the spec's own order; picking one shows its full source
    at first the file that describes this very section is picked
    the source sits in a frame that scrolls up and down when it is taller than the frame
    Scenario: this section shows its own spec first
      Given the page is open
      Then the file "home/sections/this-page.ail.md" is shown as picked
      And the region named "Source of home/sections/this-page.ail.md" contains "node ThisPage : flow"
    Scenario: picking another file
      Given the page is open
      When the visitor picks "site.ail.md"
      Then "site.ail.md" is shown as picked and "home/sections/this-page.ail.md" is not
      And the region named "Source of site.ail.md" contains "node AIL : system"
    Scenario: the size comes from the spec
      Given the page is open
      Then the size line reads as many nodes and as many files as the spec data lists
  look
    band      Section with id "this-page", tone raised
    layout    stack(v, gap: space.6, align: stretch) [ head, size, files, frame ]
    head      SectionHeading with eyebrow from self.eyebrow, text from self.heading, lead from self.lead
    size      a p: font.small, weight 700, color.accent, margin 0
    files     a div with role group named by self.files: stack(h, gap: space.2, align: center, wrap: true), one file button per spec file
    file      a button with type "button": font.mono at font.tiny, pad space.1 space.3, radius.pill, a 1px solid color.border border, background color.surface, color color.text, cursor pointer
    picked    the picked file button instead has background color.accent, color color.on.accent, and a 1px solid color.accent border
    frame     a div: max-height 560px, overflow-y auto, radius.lg, a 1px solid color.border border, background color.code
    source    CodeBlock inside the frame
  copy
    self.eyebrow  "Dogfooding"
    self.heading  "This page is written in AIL, too"
    self.lead     "Everything above was compiled from these files by ail build. They are read from the spec at build time, so this is always the spec this page was built from."
    self.size     "{nodes} nodes in {files} files"
    self.files    "Spec files of this page"
    self.source   "Source of {path}"
  binds
    data      specFiles and specNodes from the project's spec module
    state     useState holding the picked path, starting at "home/sections/this-page.ail.md"
    size      nodes is the number of specNodes, files the number of specFiles
    file      one per entry of specFiles, in that order, showing its path; aria-pressed true on the picked one; pressing it picks that path
    source    CodeBlock with lines = the picked file's text split on line breaks (without a trailing empty line), label = self.source with {path} filled in, caption = the picked path
  uses  Section, SectionHeading, CodeBlock, Stack
```
