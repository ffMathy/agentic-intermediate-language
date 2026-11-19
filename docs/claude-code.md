# Using AIL with Claude Code

AIL ships as a Claude Code plugin. Once it's installed, Claude Code writes and
reviews the spec with you, then compiles it, all on your Claude subscription.
No API key is needed.

## Install

The CLI needs [Bun](https://bun.sh) 1.2 or later. Then, in Claude Code:

```
/plugin marketplace add ffMathy/agentic-intermediate-language
```

```
/plugin install ail@agentic-intermediate-language
```

Restart Claude Code so the plugin's tools load.

## What the plugin adds

| | Name | What it's for |
|---|---|---|
| Command | `/ail:build [Node…]` | Compile everything that changed |
| Command | `/ail:show [what]` | The tree, a node, an audience's view (`stakeholder`, `design`, `engineer`, `specialist`), or `changes` |
| Skill | `ail` | Loaded automatically when you work on `*.ail.md` files: how to write, split, share and review nodes |
| Subagent | `ail-leaf-compiler` | Compiles one node; its only tools are `ail_context` and `ail_submit` |
| MCP tools | `ail_show`, `ail_check`, `ail_context`, `ail_submit` | What Claude uses under the hood |
| Hooks | — | Block edits to generated files, and check the spec after every `.ail.md` edit |

That's the whole surface: two commands for you, everything else for Claude.

## A typical session

1. **Ask for a feature in plain words.** For example: *"Add a scoreboard that
   counts wins for X and O across games."* The `ail` skill makes Claude change
   the spec, not the code. It starts at the highest level the change affects
   (a product claim, an experience scenario) and refines downwards until every
   leaf has examples that pin its behaviour. The post-edit hook rejects jargon
   in plain-language levels, missing refinements, and unknown design tokens.
2. **Review the spec, not the code.** Run `/ail:show changes` to see the nodes
   whose meaning changed, grouped by level, each with its why chain and every
   area a shared contract change reaches. Run `/ail:show stakeholder` for the
   plain-language view.
3. **Build.** Run `/ail:build`. For every node that isn't up to date, Claude
   starts the `ail-leaf-compiler` subagent. It sees only that node's slice of
   the spec, and its code is accepted only if every check passes. If the spec
   leaves something open, the subagent stops and asks instead of guessing, and
   you answer in the spec.
4. **Finish.** Claude runs `ail_check`: the spec is sound, everything is built
   from it, and every test passes.

Try to edit a generated file directly and the hook refuses, pointing you back
to the spec.

## The same project from a terminal or CI

```bash
bun add -g github:ffMathy/agentic-intermediate-language
```

```bash
ail check
```

```bash
ail build
```

```bash
ail show changes
```

`ail build` uses Claude Code's login when `ANTHROPIC_API_KEY` isn't set.
Each node is compiled with `claude -p`, with Claude Code's tools disabled and
from an empty directory, so only the node's slice of the spec reaches the
model.

In CI, give Claude Code a token from `claude setup-token` as
`CLAUDE_CODE_OAUTH_TOKEN` if the job needs to build. Usually it doesn't:
commit what `ail build` produced, and let CI run `ail check` through the
bundled GitHub Action:

```yaml
- uses: ffMathy/agentic-intermediate-language@main
  with:
    project: path/to/your/project
```

## Starting a new project

A project is any folder with an `ail.config.json`. Keep the spec in its own
folder:

```json
{ "specRoot": "ail" }
```

```
my-app/
  ail.config.json
  ail/            the spec: every .ail.md file, nothing else
  src/gen/        generated code, mirroring ail/'s folders
  checks/         derived checks, mirroring ail/'s folders
  index.html      hand-written
```

The root spec file (e.g. `ail/my-app.ail.md`) holds a `target` (what to generate, and the conventions
to follow), the design tokens, and the root node with its entry point:

````md
```ail
target
  code        TypeScript 5 strict, React 19 function components, named exports only
  styling     inline styles; design tokens as CSS variables (token a.b.c → "var(--a-b-c)")
  path.system src/gen/main.tsx
  path.view   src/gen/{dir}/{kebab}.tsx
  path.flow   src/gen/{dir}/{kebab}.tsx
  path.fn     src/gen/{dir}/{kebab}.ts
  libs        react react-dom
  tokens-css  src/gen/tokens.css
  generated   src/gen/**
```

```ail
catalog
  tokens
    space.2=8px  color.text=#111827
```

```ail
node MyApp : system   level: product
  why   …
  what
    1. …   refined-by: Home
  entry     Home
  children  Home
```
````

Ask Claude to flesh it out. The `ail` skill knows the format, and
[`examples/tictactoe`](../examples/tictactoe) is a complete reference.
