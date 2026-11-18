---
name: ail-profile-web-react-2026
description: Idioms for compiling AIL nodes to the web.react.2026 profile (TypeScript, React 19, Bun). Use together with ail-compile-leaf when a node's context names profile web.react.2026.
---
# web.react.2026 idioms

The profile settings are normative; this page shows how they look in code.
When this page and a golden example disagree, the golden example wins.

## Modules
- One node, one module, at the path the context gives. Named exports only.
- Import dependencies and the catalog by exactly the specifier the context
  prints (`../../engine/rules`, `../catalog`). Modules live in folders that
  mirror the spec, so never shorten or guess a path. Import nothing else
  besides `react` / `react-dom`.
- Types from `data` nodes: `import type { Game } from "../engine/game-state";`.
- The golden examples sit at the top level, so they import `./catalog`. Your
  node may sit deeper; the context's specifiers win.

## Mapping IL notation to TypeScript
| IL | TypeScript |
|---|---|
| `type T = A \| B` | `export type T = A \| B;` |
| `Cell[9]` | `Cell[]` (length is an invariant, not a type) |
| `f(x: A) -> B` | `export function f(x: A): B` |
| `x := y` inside a rule | build a new object; never mutate inputs |
| `9 × null` | `Array(9).fill(null)` |
| `otherwise: unchanged (same reference)` | `return game;` |
| a union written `{ kind: "won", ... }` | a discriminated union on `kind` |
| action `place(i)` | `{ type: "place", index: i }` unless `what` spells it out |

## Views and flows
- `look.layout stack(...) [ ... ]` becomes nested `<Stack>` exactly in the
  listed order. Tokens are passed by name (`gap="space.4"`); the catalog turns
  them into CSS variables.
- Styles that the catalog cannot express go in an inline `style` object using
  `var(--token-name)`; px only when `look` states px.
- `copy` keys are not runtime lookups: inline the string, interpolating
  `{placeholders}`.
- `binds` lists the props and state; name props exactly as written there.
- A flow owns the state `binds.state` names: `useReducer(reduce, initial())`
  or `useState(value)`. Timers come from `binds` and are cleared in the
  effect's cleanup.
- A flow that `binds` an area switch renders one child flow at a time.
  Unmounting a child resets it, which is how "starts fresh" is implemented.

## Accessibility
- Interactive elements are `<button type="button">` (via `Button`) or have an
  explicit role plus keyboard handling, as `what` describes.
- Accessible names come from `what` / `copy` verbatim.
