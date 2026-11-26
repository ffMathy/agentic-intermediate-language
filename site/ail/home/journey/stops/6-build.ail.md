# Stop 6: the build

More nodes in this folder, each in a file of its own: [`BuildFigure`](build-figure.ail.md).

```ail
node StopBuild : view   level: experience
  why   Show what the build produces from the specialist node, and how little of it a person has to read.   <- Journey
  what
    the sixth stop, in the build color, showing the start and end of the generated file
    Scenario: the build
      Given the page is open
      Then the article "stop-6" has the level 3 heading "Build: an agent compiles the node, seeing only its own slice."
      And the region named "Generated code excerpt" shows its seven lines, with "export function choose" highlighted
  look
    stop     JourneyStop with number 6, color color.level.build, figure BuildFigure
  copy
    build.depth     "build"
    build.chip      "BUILD"
    build.reader    "nobody has to: an agent writes it, and reviewers may skim it"
    build.headline  "Build: an agent compiles the node, seeing only its own slice."
    build.body      "ail build hands this node, plus only the contracts of the nodes it uses, to a compiler agent. If something important were left open, the agent would stop and ask instead of guessing. It writes one TypeScript file whose doc comment quotes the clause it implements, and the lock file records a hash of exactly what it saw, so a later hand edit is caught."
    build.label     "Generated code excerpt"
    build.file      "examples/tictactoe/src/gen/engine/computer-player/computer-player.ts (generated, never edited by hand)"
    build.line.1    "/** choose(board: Board, me: Mark = "O") -> number — full minimax over the remaining game tree, memoized by board; among equally scored moves, the lowest index */"
    build.line.2    "export function choose(board: Board, me: Mark = "O"): number {"
    build.line.3    "  let bestIndex = -1;"
    build.line.4    "  let bestScore = -Infinity;"
    build.line.5    "  …"
    build.line.6    "  return bestIndex;"
    build.line.7    "}"
    build.mark      "export function choose"
    build.turns     "One generated file of 69 lines. A reviewer reads the 27-line node instead."
  binds
    stop     JourneyStop with depth build.depth, chip build.chip, reader build.reader, headline build.headline, explanation build.body, lines build.line.1 to build.line.7, label build.label, file build.file, highlight [build.mark], turnsInto build.turns
  uses      JourneyStop, BuildFigure
  children  BuildFigure
```
