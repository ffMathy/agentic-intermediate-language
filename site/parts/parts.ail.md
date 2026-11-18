# Parts

Shared by every section: one owner here, many users.

```ail
node Parts : library   level: experience
  why   Pieces every section shares, so they look the same everywhere.   <- AIL
  children  SectionHeading, CodeBlock
```

```ail
node SectionHeading : view   level: experience
  why   Every section starts the same way.   <- Parts
  what
    shows the given text as a level 2 heading, optionally linkable by the given id
    Scenario: a heading
      Given the text "Get started" and the id "get-started"
      Then a level 2 heading reads "Get started" and can be linked to as #get-started
  look
    text     font.heading, weight 700, color.text, no margin
  binds
    props    text: string, id?: string
```

```ail
node CodeBlock : view   level: experience
  why   Commands and spec samples get read and copied, so they must be exact and legible.   <- Parts
  what
    shows the given lines exactly, one per line, keeping every space
    is a region named with the given label, so screen readers can announce it
    long lines scroll sideways instead of wrapping
    Scenario: shown exactly
      Given the lines "a  b" and "  c" and the label "Sample"
      Then the region named "Sample" contains exactly those two lines, joined by a line break
  look
    block    background color.code, text color.code.text, radius.md, pad space.4, monospace at font.code, no margin, sideways scrolling
  binds
    props    lines: string[], label: string
    element  a pre element
```
