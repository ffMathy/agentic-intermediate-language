# Agent instructions

## In any AIL project (a folder with `ail.config.json`)

- The `*.ail.md` files are the source of truth. Generated code (the target's
  `generated` globs, e.g. `src/gen/**`) is never edited by hand: hooks block
  it, and `ail build` reports it.
- A spec file holds one node, and a folder one spec file. A new node gets a
  folder of its own, named after it: `new-game-button/new-game-button.ail.md`.
- To change behaviour, change the spec, then build: the plugin's `build`
  command (`/ail:build` in Claude Code), or `ail build` in a terminal.
- If the spec leaves something open and it isn't in `free`, stop and ask for a
  spec change. Never guess in code.
- Before finishing, `ail build` (or `/ail:build`) must pass: it compiles what
  changed and then checks everything, the end-to-end checks included. A build
  in which any check didn't run has failed: install what it needs, or say what
  is missing. Never present skipping checks as an option.
- A pull request for a change to an AIL project carries the build's checks in
  its description, for what the change affects only: build with
  `--since <base branch>` (`ail_build` with `since`), push, and put
  `ail show checks` (`ail_show` with `checks`) between its `<!-- ail-checks:<project> -->` markers, or add it at
  the end, and leave the rest of the description alone. Paste it exactly as
  it comes, its screenshot images included: never shorten or summarize it.

## In this repository (the toolchain)

- Use Bun for everything. Run `bun install && bun link` once, then
  `bun test` and `bun run typecheck`. Example projects depend on the linked
  `ail`.
- `bun test` includes end-to-end checks of `examples/tictactoe`, which needs
  `bun install` in that folder first.
- `site/` is the website, and it is an AIL project. Change its pages through
  its spec in `site/ail/` and `ail build`, never by editing `site/src/gen`.
  Its spec browser (a read-only Monaco editor) shows `site/src/gen/spec.ts`,
  which `ail build` writes without a model from both `site/ail/` and
  `examples/tictactoe/ail/`. So after editing the kata's spec, also run
  `ail build` in `site/` (no model calls are needed for that), or the site's
  build fails its check.
- The plugin ships to Claude Code (`.claude-plugin/`, `hooks/hooks.json`),
  Cursor (`.cursor-plugin/`, `hooks/cursor.json`) and GitHub Copilot
  (`.github/plugin/`, `hooks/copilot.json`). They share `skills/`,
  `commands/` and `src/mcp.ts`, so a change to one surface reaches all three.
  `tests/agents.test.ts` runs each agent's hooks.
- If you change the prompts or the context format, compile hashes
  change. Rebuild `examples/tictactoe` and `site` so that `ail build` passes in
  both.
