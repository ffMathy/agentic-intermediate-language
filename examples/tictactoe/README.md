# Tic-Tac-Toe kata

The complete AIL example: [`tictactoe.ail.md`](tictactoe.ail.md) is the
source. Everything under `src/gen/` and `index.html` is generated.

| path | what it is | written by |
|---|---|---|
| `tictactoe.ail.md` | the spec, from product claims down to a minimax proof | people |
| `src/gen/*.ts(x)` | one module per compilable node | the leaf compiler (a model), via `ail submit` |
| `src/gen/tokens.css`, `src/gen/catalog/`, `src/gen/main.tsx`, `index.html` | deterministic glue | `ail glue`, from the profile; no model involved |
| `checks/*.test.ts(x)` | derived checks for scenarios and `verify` items, pinned to a spec hash | generated once, then reviewed |
| `ail.lock.json` | which compile hash produced which file | `ail` |

```bash
bun install
```

```bash
bun run verify
```

```bash
bun run dev
```

Things to try:

- `bun ../../src/cli.ts lens stakeholder` shows the plain-language view.
- `bun ../../src/cli.ts lens specialist --tag ai` shows the computer player
  with its why chain.
- Change the 300 ms in `PlayAGame` and run `bun run plan`. Only `PlayAGame`
  goes stale.
- Change the `how` of `ComputerPlayer`. Its dependants stay fresh, because a
  dependency's `how` is encapsulated.
- Delete the tie-break line from `ComputerPlayer` and run
  `bun ../../src/cli.ts diverge ComputerPlayer --samples 3 --model "command:claude -p"`.
  The models stop and ask instead of guessing.
