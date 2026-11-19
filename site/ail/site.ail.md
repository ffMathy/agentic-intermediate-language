# The AIL website

This page is itself written in AIL and compiled by `ail build`. The GitHub
Pages workflow runs `ail build` on it (with nothing to compile, that only
checks) and bundles what is committed. The
Tic-Tac-Toe demo is published next to it at `./demo/`.

The page tells one story: a single sentence from the real Tic-Tac-Toe spec,
"The computer never loses.", followed from the product level down to the code
that keeps it, the check that proves it, and the game you can play.

```
site.ail.md                              🟢 AIL (this file)
home/home.ail.md                         🟡 HomePage: the one page, top to bottom
home/sections/*.ail.md                   🟡 TopBar, GapStrip, SpecBrowser, GetStarted, Footer
home/hero/hero.ail.md                    🟡 Hero, HeroFigure
home/journey/journey.ail.md              🟡 Journey, JumpGauge, JourneyStop
home/journey/stops/*.ail.md              🟡 the eight stops and their figures
home/readers/readers.ail.md              🟡 Readers, ReadersTree
home/build-loop/build-loop.ail.md        🟡 BuildLoop, LoopFigure
parts/*.ail.md                           🟡 Parts (library): Stack, Section, SectionHeading, CodeBlock, CopyCommand, MiniBoard, SpecEditor
```

## Target

```ail
target
  code         TypeScript 5 in strict mode, ES modules, no `any`; React 19 function components only
  libs         react react-dom @monaco-editor/react
  exports      named exports only; a view or flow exports a component named exactly like its node; export every name `what` mentions and nothing else except types
  props        named exactly as `binds` lists them
  state        a flow owns exactly the state `binds.state` names, with useState; never mutate inputs
  effects      only flows use useEffect, and only for the timers `binds` names, cleared in the effect's cleanup
  styling      inline style objects only, no class names and no style elements; design tokens as CSS variables (token a.b.c → "var(--a-b-c)"); literal px, %, fr, ch, em and rgba values only where `look` gives them
  responsive   no media queries and no width measuring in components: wrapping comes from grid auto-fit with minmax, flex-wrap, clamp() and max-width, exactly as `look` gives them. The only exception is two classes defined in index.html: an element with class "ail-wide" shows only at 600px viewport width or more, and one with class "ail-narrow" only below 600px
  svg          inline SVG elements with exactly the viewBox, shapes, coordinates and colors `look` gives; numbers in `look` are SVG user units; SVG text uses font-family var(--font-sans) unless `look` says mono, which is var(--font-mono)
  images       no image files, icon fonts or external scripts; every picture is inline SVG
  motion       animations only through the keyframes defined in index.html (ail-thread, ail-dash), referenced from inline styles; index.html turns them off under reduced motion
  layout       stack(v|h, gap: t, align: a, pad: t) [ A, B ] means the Stack node with those props and those children, in that order
  copy         user-visible text is the `copy` text verbatim, with {placeholders} filled in; a copy value is everything between the first and the last double quote on its line, so inner quotes and leading spaces are part of the text
  links        plain anchor elements with exactly the href `binds` gives and no target attribute
  a11y         interactive elements are native buttons or links, or have a role and keyboard handling; accessible names come from `copy`; decorative SVGs are aria-hidden, informative ones have role img and an aria-label from `copy`
  comments     one JSDoc line per export quoting the clause it implements; no other comments
  formatting   2-space indent, double quotes, semicolons, trailing commas in multi-line literals
  entry        the system node compiles to an entry module that renders its `entry` node into the element with id "root"
  path.system  src/gen/main.tsx
  path.data    src/gen/{dir}/{kebab}.ts
  path.fn      src/gen/{dir}/{kebab}.ts
  path.view    src/gen/{dir}/{kebab}.tsx
  path.flow    src/gen/{dir}/{kebab}.tsx
  tokens-css   src/gen/tokens.css
  generated    src/gen/**
  tests        bun test with @testing-library/react and happy-dom
```

## Glossary

```ail
glossary
  term spec      plain "the description people write and review"                    formal the *.ail.md files
  term node      plain "one part of the spec, with its why, what and how"           formal an AIL node
  term level     plain "how detailed a part of the spec is, and who it is for"      formal product, experience, system or specialist
  term reader    plain "the kind of person a level is written for"                  formal a lens of ail show
  term build     plain "turning the spec into working code"                         formal ail build
  term check     plain "proving the code still does what the spec says"             formal the check that ends every ail build
  term thread    plain "the one promise this page follows down the spec"            formal "The computer never loses." in examples/tictactoe
  term stop      plain "one step of the journey down the spec"                      formal JourneyStop
  term demo      plain "the Tic-Tac-Toe game built entirely from a spec"            formal examples/tictactoe, published at ./demo/
```

## Design tokens

Values contain no spaces, because the catalog separates tokens with spaces.

```ail
catalog
  tokens
    space.1=4px  space.2=8px  space.3=12px  space.4=16px  space.6=24px  space.8=32px  space.12=48px  space.16=64px
    radius.sm=6px  radius.md=8px  radius.lg=12px  radius.xl=20px  radius.pill=999px
    width.content=1080px  width.prose=68ch
    font.sans=Inter,system-ui,sans-serif  font.mono=Inconsolata,ui-monospace,monospace
    font.hero=clamp(34px,5.5vw,56px)  font.heading=clamp(26px,3.5vw,36px)  font.stop=clamp(22px,2.6vw,28px)
    font.lead=18px  font.body=16px  font.small=14px  font.code=14px  font.tiny=12px  font.micro=11px
    color.page=#ffffff  color.surface=#ffffff  color.surface.raised=#f3f4f6  color.border=#d1d5db
    color.text=#111827  color.text.muted=#4b5563  color.on.accent=#ffffff
    color.accent=#6d28d9  color.accent.soft=#f5f3ff  color.focus=#2563eb
    color.code.bar=#0b1120  color.code.side=#111a2e  color.code.pick=#1e293b  color.dot.red=#ef4444  color.dot.amber=#f59e0b  color.dot.green=#22c55e
    color.code=#0f172a  color.code.text=#e2e8f0  color.code.muted=#94a3b8  color.code.border=#334155
    color.thread=#fde68a  color.thread.soft=rgba(253,230,138,0.22)  color.thread.strong=#eab308
    color.level.product=#16a34a  color.level.experience=#ca8a04  color.level.system=#ea580c  color.level.specialist=#dc2626  color.level.build=#475569
    color.step.check=#2563eb  color.pass=#16a34a  color.stop.soft=#fffbeb  color.stop.text=#b45309
    color.player.x=#2563eb  color.player.o=#dc2626
```

---

## 🟢 Product

```ail
node AIL : system   level: product
  why   Someone who has never heard of AIL should understand what it does, see it work on a real example, and know how to start, in a few minutes of scrolling.
  what
    1. A visitor learns what AIL is in one sentence, before scrolling.                       refined-by: Hero
    2. A visitor sees why a layer between a request and the code is worth having.            refined-by: GapStrip
    3. A visitor follows one real sentence through every level of a real spec.               refined-by: Journey
    4. A visitor sees the code and the check that the sentence turns into.                   refined-by: StopBuild, StopProof
    5. A visitor plays the finished product built from that spec, on the same page.          refined-by: StopResult
    6. A visitor sees that each level is written for a different kind of reader.            refined-by: Readers
    7. A visitor sees how a change to the spec becomes checked code.                         refined-by: BuildLoop
    8. A visitor can start from Claude Code or from a terminal.                              refined-by: GetStarted
    9. A visitor can browse the specs of this page and of the demo in a code editor.         refined-by: SpecBrowser
  entry     HomePage
  children  HomePage, Parts
```
