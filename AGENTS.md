# Agent instructions

## In any AIL project (a folder with `ail.config.json`)

- The `*.ail.md` files are the source of truth. Generated code (the target's
  `generated` globs, e.g. `src/gen/**`) is never edited by hand: hooks block
  it, and `ail check` reports it.
- To change behaviour, change the spec, then build: `/ail:build` in Claude
  Code, or `ail build` in a terminal.
- If the spec leaves something open and it isn't in `free`, stop and ask for a
  spec change. Never guess in code.
- Before finishing, `ail check` (or the `ail_check` tool) must pass.

## In this repository (the toolchain)

- Use Bun for everything. Run `bun install && bun link` once, then
  `bun test` and `bun run typecheck`. Example projects depend on the linked
  `ail`.
- `bun test` includes end-to-end checks of `examples/tictactoe`, which needs
  `bun install` in that folder first.
- `site/` is the website, and it is an AIL project. Change its pages through
  its spec in `site/ail/` and `ail build`, never by editing `site/src/gen`.
  Its "This page" section shows `site/src/gen/spec.ts`, which `ail build`
  writes from the spec without a model.
- If you change the prompts or the context format, compile hashes
  change. Rebuild `examples/tictactoe` and `site` so that `ail check` passes in
  both.
