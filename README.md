# AIL — Agentic Intermediate Language

![AIL: write the spec, let agents build the code, prove that they agree](docs/cover.png)

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

Then ask for features in plain words. Claude changes the spec, not the code,
and one command does the rest:

| | |
|---|---|
| `/ail:build` | compile whatever changed (each node sees only its own slice of the spec), then check everything |
| `/ail:adopt <url>` | bring an existing app under AIL: see below |

To look at the spec, just ask: "show me the tree", "the stakeholder view",
"what changed?".

See **[docs/claude-code.md](docs/claude-code.md)** for the full guide.

## Use it from a terminal

The CLI needs [Bun](https://bun.sh) 1.2 or later.

```bash
bun add -g github:ffMathy/agentic-intermediate-language
```

Then, anywhere inside a project (any folder with an `ail.config.json`):

| | |
|---|---|
| `ail build` | Compile whatever changed, then check everything: the spec is sound, the code is built from it, every check passes, and each screen matches its `look`. With nothing to compile it only checks, without a model, so CI runs it too. It uses Claude Code's login unless `ANTHROPIC_API_KEY` is set; `--model` picks another provider. |
| `ail adopt --app <url>` | Does the app running there behave as the spec says? Runs each flow's end-to-end check in a browser. |
| `ail show [what]` | The tree, a node, an audience's view (`stakeholder`, `design`, `engineer`, `specialist`), or `changes`. Add `--shots <dir>` for screenshots of the proofs |

That's the whole tool. Change detection, deriving tests from scenarios,
writing the token CSS and cleaning up after moved or deleted nodes all happen
inside `ail build`.

## Adopt an existing app

AIL also works in reverse. To bring an existing app under AIL, or to move it to
another technology, write its spec from what already exists, one slice at a
time:

1. **Why**, from its tickets (Asana, Jira, Linear, through Claude's connectors)
   and from interviewing the people who own it. A reason nobody can confirm
   is written down as unknown, and every build lists it until someone answers.
2. **What**, from driving the running app in a browser: every screen, text and
   error path, quirks included.
3. **How**, from its code: data shapes, rules, edge cases and real values as
   examples.
4. **Proof.** Each flow gets an end-to-end check that plays its scenarios in a
   browser. `ail adopt --app <url>` runs them against the old app, which proves
   the spec describes it.

Then change the `target` to the new technology and run `ail build`. Run
`ail adopt --app <url>` against the new app, and the same checks prove that it
behaves like the old one. Each node's `sources` section records where its
claims came from, for review.

In Claude Code, `/ail:adopt <url>` does all of this, one slice at a time. The
demo has an example check at
[`examples/tictactoe/checks/e2e/`](examples/tictactoe/checks/e2e).

## Try the demo locally

```bash
cd examples/tictactoe
```

```bash
bun install
```

```bash
ail build
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

The action runs `ail build` (which, with nothing to compile, only checks) and puts a review of the spec changes in the job
summary. On pull requests it also keeps one comment per project up to date
with that review and with **screenshots of the proofs**. The screenshots show
the final screen of every scenario of each changed node that has a `look`,
and of the nodes that use it. They are rendered in Chromium from the derived
checks, and the comment shows them through the `ail-shots` branch. Give the
job `contents: write` and `pull-requests: write`, and check out with
`fetch-depth: 0`. To take the same screenshots locally (this needs
Playwright), run:

```bash
ail show changes --shots .ail/shots
```

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

The spec is a tree of tasks that are all alike, compiled one node at a time,
each by a fresh call that sees only its own slice. The idea is inspired by
[Recursive Language Models](https://arxiv.org/abs/2512.24601) (Zhang, Kraska
and Khattab, MIT CSAIL), where a model calls itself on just the parts of a long
input it needs.

The full design is in [docs/proposal.md](docs/proposal.md).

## Repository layout

```
src/                 the ail CLI and MCP server (Bun, TypeScript)
prompts/             instructions given to the compiling model
skills/ commands/ hooks/ .claude-plugin/    the Claude Code plugin
examples/tictactoe/  the demo: spec in ail/, generated code, derived checks, lock file
site/                the website, written in AIL (spec in site/ail/); its spec browser shows both example specs in a read-only Monaco editor
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
