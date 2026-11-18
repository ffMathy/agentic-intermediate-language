# Agent instructions

## In any AIL project (a directory with `ail.config.json`)

- The `*.ail.md` files are the source of truth. Generated code (the profile's
  `generated` globs, e.g. `src/gen/**`) is never edited by hand. Hooks block
  it, and `ail plan` reports it as drift.
- To change behaviour, edit the IL (skill `ail-author`), then compile.
- To implement a node, get its context (`ail context <Node>` or the
  `ail_context` tool), write the module from that context only, and hand it in
  with `ail submit` or `ail_submit`.
- If the spec doesn't determine something and it isn't in `free`, stop and ask
  for an IL change. Don't guess in code.
- Before you finish: `ail lint`, `ail plan --check` and `ail verify` all pass.

## In this repository (the toolchain)

- Use Bun for everything: `bun install`, `bun test`, `bun run typecheck`, and
  `bun src/cli.ts <command>`.
- `bun test` includes an end-to-end check of `examples/tictactoe`, which needs
  `bun install` run inside that directory first.
- If you change the profile, the skills or the context format, the kata's
  compile hashes change. Recompile, or re-submit the affected nodes, so that
  `ail plan --check` passes in `examples/tictactoe`.
