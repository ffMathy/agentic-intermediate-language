---
name: ail-author
description: Write or change AIL (*.ail.md) specifications — the why/what/how tree that agents compile into code. Use when adding a feature, changing behaviour, or answering a STOP question from the compiler; edit the IL, never the generated code.
---
# Authoring AIL

An AIL spec is a tree of nodes. Each node says **why** it exists, **what** it
does observably and **how** key decisions were made, then delegates detail to
its children. People review the IL and an agent compiles the leaves.

## Node shape
```ail
node Name : kind   level: product|experience|system|specialist   @tag
  why       rationale   <- AncestorName
  what      the observable contract
  how       decide X
              because Y
              rejected Z because W
  look      layout and visual expression, in catalog tokens and components
  copy      key "user-visible text"
  binds     props, state and events, connecting a view to logic
  free      [ the only things the compiler may choose ]
  uses      nodes whose contract this one depends on
  children  nodes that refine this one
  verify    properties that need a derived check (e.g. exhaustive search)
```
Kinds: `system` (the root, has `entry`), `flow`, `view`, `data`, `fn`, and
`library` (groups shared nodes; never compiled).

## Levels: who reads what
| level | reader | language |
|---|---|---|
| product | anyone | plain sentences; every claim ends `refined-by: Child` |
| experience | design, QA, product | glossary terms, Given/When/Then scenarios, look and copy |
| system | generalist engineers | types, contracts, `expr => expected` examples, decisions |
| specialist | experts | precise invariants and algorithms |

A child is never less detailed than its parent. `ail lint` rejects jargon and
code notation in `product` and `experience` prose. Put notation in `look`,
`copy` or `binds`, or move it down a level. Define domain words once in the
`glossary` with a plain and a formal meaning.

## Folders, splitting and reuse
- Put a node in the folder of its parent, or in a subfolder. The folders should
  read like the tree. Generated code mirrors them.
- When a node grows past the size budget (lint `node-too-large`), split it:
  move detail into child nodes in a subfolder named after the node.
- To share a node between areas, give it one owner: a `library` node (e.g.
  `board/board.ail.md` with `node BoardKit : library`). Then list it under
  `uses` in every area that needs it. Never make it the child of two parents.
- A shared node's `what` is a contract with every user. `ail review` lists
  everything a change reaches, so keep it small and pinned by examples.
- After moving or deleting nodes, run `ail plan`: moved nodes recompile in
  their new place, and `ail prune` removes the output of deleted ones.

## Making the output deterministic
- **Examples are the cheapest pin.** `evaluate(boardFrom("XXX/OO_/___")) => { kind: "won", mark: "X", line: [0, 1, 2] }`.
- **Name every export** a dependant or a test will use, with its signature.
- **State tie-breaks.** Whenever more than one answer is correct, say which one wins.
- **`free` is a whitelist.** Anything not in it must follow from the spec, the profile or the goldens.
- **Probes find gaps.** List inputs under `probes` that you suspect are under-specified; `ail diverge` compares them across models and samples.
- Every decision gets a `because`, and the real alternatives get a `rejected`.

## Workflow
1. Edit the `.ail.md` file. The post-edit hook runs `ail lint`.
2. `ail plan` shows which nodes went stale (only the nodes whose context changed).
3. Compile with `ail compile`, or in an agent session use the `ail_context` and
   `ail_submit` tools node by node.
4. `ail verify`, then `ail review --base origin/main` to see the change the way reviewers will.
5. When a compiler replies `STOP: question`, answer the question in the IL. Don't answer it in code.
