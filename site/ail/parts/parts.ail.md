# Parts

The building blocks every section shares: one owner here, many users. Code
panels live in [`code.ail.md`](code-block/code-block.ail.md) and the small game board used by
the figures in [`mini-board.ail.md`](mini-board/mini-board.ail.md).

More nodes, each in a folder of its own: [`Stack`](stack/stack.ail.md), [`Section`](section/section.ail.md), [`SectionHeading`](section-heading/section-heading.ail.md).

```ail
node Parts : library   level: experience
  why   Every section is built from the same few pieces, so the page looks consistent from top to bottom.   <- AIL
  children  Stack, Section, SectionHeading, CodeBlock, CopyCommand, MiniBoard, SpecEditor, SpecShot
```
