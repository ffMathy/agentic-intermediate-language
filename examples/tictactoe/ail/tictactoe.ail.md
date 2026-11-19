# Tic-Tac-Toe

The whole product, specified as an AIL tree. Read from the top: each level is
more detailed than the one above it, and you can stop reading wherever the
detail stops mattering to you.

The folders mirror the tree. Shared parts sit in `library` nodes with one
owner, and each area lists them under `uses`:

```
tictactoe.ail.md                         🟢 TicTacToe (this file)
app/app.ail.md                           🟡 App: switches between the two areas
ui/ui.ail.md                             🟡 UiKit (library): Stack, Text, Button, Segmented
app/play/play.ail.md                     🟡 PlayAGame, NewGameButton, ChooseOpponent
app/demo/demo.ail.md                     🟡 WatchADemo
board/board.ail.md                       🟡 BoardKit (library): BoardView, StatusLine
engine/engine.ail.md                     🟠 Engine (library): GameState, Rules, GameReducer
engine/computer-player/computer-player.ail.md   🔴 ComputerPlayer
```

Both areas, play and watch, reuse the same board, status line, rules and
computer player. Generated code mirrors these folders under `src/gen/`.

## Target

What to generate, and the conventions every compiler must follow. It is part
of the spec, so it is reviewed like everything else.

```ail
target
  code         TypeScript 5 in strict mode, ES modules, no `any`; React 19 function components only
  libs         react react-dom
  exports      named exports only; a view or flow exports a component named exactly like its node; export every name `what` mentions and nothing else except types
  props        named exactly as `binds` lists them
  state        a flow owns exactly the state `binds.state` names (useReducer for a reducer, useState for a single value); logic lives in fn modules; never mutate inputs
  effects      only flows use useEffect, and only for the timers `binds` names, cleared in the effect's cleanup
  styling      inline style objects; design tokens as CSS variables (token a.b.c → "var(--a-b-c)"); px only where `look` gives px
  layout       stack(v|h, gap: t, align: a, pad: t) [ A, B ] means the Stack node with those props and those children, in that order
  copy         user-visible text is the `copy` text verbatim, with {placeholders} filled in
  a11y         interactive elements are native buttons, or have a role and keyboard handling; accessible names come from `copy`
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
  term mark         plain "an X or an O"                                  formal Mark = "X" | "O"
  term turn         plain "whose go it is"                                formal Game.next
  term square       plain "one of the nine places on the board"          formal Board index 0–8, row by row
  term line         plain "three squares in a row, column or diagonal"   formal an entry of Rules.LINES
  term win          plain "three of your marks in a line"                formal status.kind = "won"
  term draw         plain "the board is full and nobody won"             formal status.kind = "draw"
  term "game over"  plain "someone won, or it's a draw"                  formal status.kind ≠ "playing"
  term computer     plain "the built-in opponent, which always plays O"  formal ComputerPlayer
```

## Design tokens

```ail
catalog
  tokens
    space.1=4px  space.2=8px  space.4=16px  space.6=24px  radius.md=8px
    font.body=16px  font.status=18px  font.mark=40px
    color.surface=#ffffff  color.surface.raised=#f3f4f6  color.border=#d1d5db
    color.text=#111827  color.text.muted=#6b7280  color.action=#111827  color.action.text=#ffffff
    color.player.x=#2563eb  color.player.o=#dc2626  color.highlight=#fde68a  color.focus=#2563eb
```

---

## 🟢 Product

```ail
node TicTacToe : system   level: product
  why   A quick, familiar game people can finish in under a minute,
        alone or with a friend on the same device.
  what
    1. Two players take turns placing their mark on a 3 × 3 board.          refined-by: PlayAGame
    2. Three marks in a line wins; a full board with no winner is a draw.   refined-by: Rules
    3. You can play against a friend or against the computer.               refined-by: ChooseOpponent
    4. The computer never loses.                                            refined-by: ComputerPlayer
    5. You can start a new game at any time.                                refined-by: NewGameButton
    6. You can watch the computer play itself, move by move.                refined-by: WatchADemo
  entry     App
  children  App, BoardKit, Engine, UiKit
```
