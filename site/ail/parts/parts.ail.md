# Parts

The building blocks every section shares: one owner here, many users. Code
panels live in [`code.ail.md`](code.ail.md) and the small game board used by
the figures in [`mini-board.ail.md`](mini-board.ail.md).

More nodes in this folder, each in a file of its own: [`Stack`](stack.ail.md), [`Section`](section.ail.md), [`SectionHeading`](section-heading.ail.md).

```ail
node Parts : library   level: experience
  why   Every section is built from the same few pieces, so the page looks consistent from top to bottom.   <- AIL
  children  Stack, Section, SectionHeading, CodeBlock, CopyCommand, MiniBoard, SpecEditor, SpecShot
```
