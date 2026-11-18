# Tic-Tac-Toe kata

The complete AIL example. [`tictactoe.ail.md`](tictactoe.ail.md) is the root
of the spec, and the folders below it mirror the tree: `app/play` and
`app/demo` are two areas that both reuse `board/` and `engine/`. Everything
under `src/gen/` (same folders) and `index.html` is generated.

| path | what it is | written by |
|---|---|---|
| `**/*.ail.md` | the spec, from product claims down to a minimax proof | people |
| `src/gen/**/*.ts(x)` | one module per compilable node, in the same folders as its spec | a model, via `ail build` or `/ail:build` |
| `src/gen/tokens.css`, `src/gen/catalog/`, `src/gen/main.tsx`, `index.html` | deterministic glue | `ail build`, from the profile; no model involved |
| `checks/**/*.test.ts(x)` | derived checks for scenarios and `verify` items, pinned to a spec hash | generated once, then reviewed |
| `ail.lock.json` | which compile hash produced which file | `ail` |

```bash
bun install
```

```bash
ail check
```

```bash
bun run dev
```

Things to try:

- `ail show` prints the tree, with each node's status and how many nodes use it.
- `ail show stakeholder` gives the plain-language view;
  `ail show specialist ai` shows the computer player with its why chain.
- Change the 300 ms in `PlayAGame` and run `ail check`. Only `PlayAGame` needs
  rebuilding.
- Change the `how` of `ComputerPlayer`. Only `ComputerPlayer` needs
  rebuilding: its users depend on its contract, not its implementation.
- Add an example to `BoardView`'s `what` and run `ail show changes --since HEAD`.
  It shows that the change reaches both the play area and the watch area.
- Run `ail build` (or `/ail:build` in Claude Code) to rebuild. It needs no API
  key when Claude Code is logged in.
- Delete the tie-break line from `ComputerPlayer` and run
  `ail check ComputerPlayer --samples 3`. The models stop and ask instead of
  guessing.
