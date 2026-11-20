# Using this toolchain in Cursor

This guide is for **contributors working on this repository** in Cursor. End
users of AIL who want Claude Code's marketplace plugin should follow
[claude-code.md](claude-code.md) instead.

## What Cursor gets

| | Path | Role |
|---|---|---|
| Rules | `.cursor/rules/ail-agents.mdc` | Always on: hard rules from [AGENTS.md](../AGENTS.md) |
| Rules | `.cursor/rules/ail-spec.mdc` | When `*.ail.md` is in play: edit spec, never gen |
| Skill | `.cursor/skills/ail/` | Points at the canonical [skills/ail/SKILL.md](../skills/ail/SKILL.md) |
| MCP | `.cursor/mcp.json` | Stdio server: `bun src/mcp.ts` |

Hard rules stay in `AGENTS.md` (Claude Code loads them via `CLAUDE.md`). The
Cursor files are a host adapter, not a second source of truth.

## Enable the MCP server

1. Open this repo in Cursor.
2. Enable the project MCP server `ail` when Cursor prompts, or turn it on under
   MCP settings.
3. Confirm tools `ail_show`, `ail_build`, and `ail_adopt` appear.

The server is the same process the Claude Code plugin uses. It needs
[Bun](https://bun.sh) 1.2 or later on your `PATH`.

## Develop

```bash
bun install && bun link
```

```bash
bun test
```

```bash
bun run typecheck
```

Example projects depend on the linked `ail` binary. `examples/tictactoe` and
`examples/connect4` need `bun install` in those folders before their checks run.

## Typical session

1. Change behaviour in `*.ail.md` (or ask the agent to), never in generated
   trees such as `src/gen/**` or `site/src/gen/**`.
2. Use MCP `ail_show` (or `ail show`) to inspect the tree, a node, or changes.
3. Build with MCP `ail_build` or `ail build`. It must pass before you finish.
4. If the compiler returns `STOP: …`, answer in the spec; do not guess in code.

Slash commands `/ail:build` and `/ail:adopt` are Claude Code plugin surfaces.
In Cursor, call the MCP tools or the CLI instead.

## Platform note (Windows)

This Cursor adapter and the Connect 4 example were exercised only on **Windows**.
Steps that assume a POSIX shell (`sh` / bash)—for example some `ail adopt`
process hooks, `command:` compile providers, and certain CI/site check
invocations—were **not** re-verified here. Prefer WSL, macOS, or Linux when
you need those paths; treat Windows results as partial coverage until then.
