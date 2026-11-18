---
description: Compile everything in the AIL spec that changed, inside Claude Code (no API key needed)
argument-hint: "[Node ...]"
---
Build the AIL project, with Claude Code as the compiler.

1. Call `ail_show` to see the tree with each node's status. Work on the nodes
   named in "$ARGUMENTS", or, if none are named, on every node whose status is
   not `fresh`.
2. For each node, run the `ail-leaf-compiler` subagent with the prompt
   `Compile <Node>`. Start a node only after the nodes it `uses` are done.
   Nodes that don't depend on each other may run in parallel.
3. Never write generated files yourself, and never answer a `STOP:` question in
   code. Collect the questions.
4. Finish with `ail_check`. Report:
   - which nodes were compiled
   - which were rejected, with the failing checks
   - which stopped, with the question the spec must answer
