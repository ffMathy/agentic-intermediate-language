# The AIL website

This page is itself written in AIL and compiled by `ail build`. The GitHub
Pages workflow only runs `ail check` on it and bundles what is committed.

```ail
use profile web.react.2026
```

```ail
glossary
  term spec    plain "the description people write and review"            formal the *.ail.md files
  term node    plain "one part of the spec, with its why, what and how"   formal an AIL node
  term build   plain "turning the spec into working code"                 formal ail build
  term demo    plain "the Tic-Tac-Toe game built entirely from a spec"   formal examples/tictactoe
```

Site-specific design tokens, added to the profile's catalog:

```ail
catalog
  tokens
    space.8=32px  space.12=48px  font.hero=44px  font.heading=24px  font.code=14px
    color.accent=#6d28d9  color.code=#0f172a  color.code.text=#e2e8f0
```

```ail
node AIL : system   level: product
  why   A developer should understand what AIL is, and start using it, within two minutes.
  what
    1. A visitor learns what AIL does in one sentence.             refined-by: Hero
    2. A visitor sees the loop of writing, building and checking.  refined-by: Steps
    3. A visitor sees a real piece of a spec.                      refined-by: SpecSample
    4. A visitor can start from Claude Code or from a terminal.    refined-by: GetStarted
    5. A visitor knows the whole tool is three commands.           refined-by: Commands
    6. A visitor can try a product built entirely from a spec.     refined-by: Hero
  entry     HomePage
  children  HomePage, Parts
```
