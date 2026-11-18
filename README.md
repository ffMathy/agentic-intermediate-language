# AIL — Agentic Intermediate Language

**Write the spec. Let agents build the code. Prove that they agree.**

AIL is a recursive *why / what / how* specification. People review the spec:
plain language at the top, precise contracts further down. Any model compiles
it, node by node, and every check the spec implies runs against the result.
The same spec gives the same behaviour whichever model or vendor builds it.

🌐 **Website:** <https://ffmathy.github.io/agentic-intermediate-language/>. The
site is itself written in AIL ([`site/`](site)) and compiled by `ail build`.
It includes a playable demo.

![The Tic-Tac-Toe demo, built entirely from a spec](docs/tictactoe.png)

## Use it in Claude Code

No API key is needed; it runs on your Claude subscription.

```
/plugin marketplace add ffMathy/agentic-intermediate-language
```

```
/plugin install ail@agentic-intermediate-language
```

Then ask for features in plain words. Claude changes the spec, not the code.
Two commands do the rest:

| | |
|---|---|
| `/ail:build` | compile whatever changed; each node is built by a subagent that can only see that node's slice of the spec |
| `/ail:show [what]` | the tree, a node, a view for one audience (`stakeholder`, `design`, `engineer`, `specialist`), or `changes` |

See **[docs/claude-code.md](docs/claude-code.md)** for the full guide.

## Use it from a terminal

The CLI needs [Bun](https://bun.sh) 1.2 or later.

```bash
bun add -g github:ffMathy/agentic-intermediate-language
```

Then, anywhere inside a project (any folder with an `ail.config.json`):

| | |
|---|---|
| `ail check` | Is the spec sound, is the code built from it, and does it pass every check? |
| `ail build` | Compile whatever changed. It uses Claude Code's login unless `ANTHROPIC_API_KEY` is set; `--model` picks another provider. |
| `ail show [what]` | Same as `/ail:show` |

That's the whole tool. Change detection, deriving tests from scenarios,
regenerating glue and cleaning up after moved or deleted nodes all happen
inside `ail build` and `ail check`.

## Try the demo locally

```bash
cd examples/tictactoe
```

```bash
bun install
```

```bash
ail check
```

```bash
ail show stakeholder
```

```bash
bun run dev
```

## In CI

```yaml
- uses: ffMathy/agentic-intermediate-language@main
  with:
    project: path/to/your/project
```

The action runs `ail check` and puts a review of the spec changes in the job
summary.

## How it works

- **A node** states its `why`, its observable `what` (claims, scenarios,
  executable examples), its `how` (decisions, plus the alternatives that were
  rejected), and, for UI, its `look`, `copy` and `binds`.
- **Levels** (`product` → `experience` → `system` → `specialist`) keep the top
  readable by anyone and the bottom precise. Lint enforces the vocabulary at
  each level.
- **Folders mirror the tree.** Shared nodes have one owner (a `library` node)
  and many users through `uses`.
- **Only what changed is rebuilt.** Each node's compile hash covers exactly what
  its compiler sees, and a dependency contributes only its contract. The lock
  file records what produced each generated file, which also catches hand
  edits.
- **Gaps become questions.** A compiler that would have to guess replies
  `STOP: <question>`, and you answer it in the spec.

The full design is in [docs/proposal.md](docs/proposal.md).

## Repository layout

```
src/                 the ail CLI and MCP server (Bun, TypeScript)
prompts/             instructions given to the compiling model
profiles/            target profiles: settings, catalog, glue templates, golden examples
skills/ commands/ agents/ hooks/ .claude-plugin/    the Claude Code plugin
examples/tictactoe/  the demo: spec, generated code, derived checks, lock file
site/                the website, written in AIL
tests/               toolchain tests
```

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
