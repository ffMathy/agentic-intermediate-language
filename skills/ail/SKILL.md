---
name: ail
description: Work with AIL (*.ail.md), the why/what/how specification that agents compile into code. Use when adding or changing a feature in a project with ail.config.json, answering a STOP question from the compiler, reviewing a change to *.ail.md files, or bringing existing code under AIL. Edit the spec, never the generated code.
---
# AIL

An AIL spec is a tree of nodes. Each node says **why** it exists, **what** it
does observably, and **how** its key decisions were made. Detail is delegated
to children. People review the spec; generated code (the target's `generated`
paths) is never edited by hand, and hooks block attempts to.

Tools: `ail_show` (look around), `ail_check` (is everything right?),
`ail_context` and `ail_submit` (used by the `ail-leaf-compiler` agent). To
compile, run `/ail:build`.

## Node shape
```ail
node Name : kind   level: product|experience|system|specialist   @tag
  why       rationale   <- AncestorName
  what      the observable contract: claims, Scenario: …, examples, probes
  how       decide X
              because Y
              rejected Z because W
  look      layout and visuals, in design tokens and component nodes
  copy      key "user-visible text"
  binds     props, state and events that connect a view to logic
  free      [ the only things the compiler may choose ]
  uses      nodes whose contract this one depends on
  children  nodes that refine this one
  verify    properties that need a derived check
```
Kinds: `system` (the root, with `entry`), `flow`, `view`, `data`, `fn`, and
`library` (groups shared nodes; it is never compiled).

The project's root file also holds:
- `target`: what to generate and the conventions every compiler follows,
  including language, structure, naming, styling, and where each kind of node
  is written (`path.view src/gen/{dir}/{kebab}.tsx`)
- `catalog tokens`: the design tokens, the only values `look` may use
- `glossary`: domain words with a plain and a formal meaning

Components (buttons, layout boxes, text styles) are ordinary nodes, usually
in a `library`. A `look` that mentions one must list it under `uses`.

## Levels: who reads what
| level | reader | language |
|---|---|---|
| product | anyone | plain sentences; each claim ends `refined-by: Node` |
| experience | design, QA, product | glossary words, Given/When/Then, look and copy |
| system | engineers | types, contracts, `expr => expected` examples, decisions |
| specialist | experts | invariants and algorithms |

A child is never less detailed than its parent. Jargon and code notation are
lint errors in product and experience prose. Put notation in `look`, `copy`
or `binds`, or move it one level down. Define domain words once in the
`glossary`.

## Folders, splitting and reuse
- A node lives in its parent's folder or below it, so the folders read like the
  tree. Generated code mirrors the folders.
- A node over the size budget gets split into children in a subfolder named
  after it.
- To share a node, give it one owner (a `library` node, e.g. `board/`) and
  list it under `uses` everywhere it's needed. Never give it two parents.

## Pinning behaviour, so every model writes the same thing
- Examples are the cheapest pin: `evaluate(boardFrom("XXX/OO_/___")) => { kind: "won", mark: "X", line: [0, 1, 2] }`.
- Name every export, with its signature, that a dependant or a test will use.
- Whenever more than one answer is correct, state the tie-break.
- `free` is a whitelist. List suspected gaps under `probes`.
- Give every decision a `because`, and record the real alternatives as `rejected`.

## Workflows
**Change behaviour.** Edit the `.ail.md` file. Start at the highest level the
change affects and refine downwards. The post-edit hook lints the spec. Then
run `/ail:build`, and finally `ail_check`.

**A STOP question.** The compiler refused to guess. Answer the question in the
spec (an example, a tie-break, or a `free` entry), then rebuild. Never answer
it in code.

**Review a change.** `ail_show` with `changes` lists the nodes whose meaning
changed, grouped by level, with their why chains and every node a contract
change reaches. For each node, ask:
- Is every new behaviour pinned?
- Does every decision have a `because`?
- Did `free` grow?
- Is every product claim still refined?

Don't review generated code. If it's wrong, the spec is missing something.

**Bring existing code under AIL.** Read the code and write the node that would
compile back to the same behaviour. Trace real values into examples. When the
code doesn't show the reason for something, write
`because "unknown, confirm with the owner"`. Never invent a rationale.
