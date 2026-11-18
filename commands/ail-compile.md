---
description: Compile stale AIL nodes inside Claude Code, with no API key needed
argument-hint: "[Node ...]"
---
Compile the AIL project in this session. Claude Code is the compiler, so this
runs on whatever Claude Code is logged in with, including a Claude subscription.

1. Call `ail_plan`. Work on the nodes named in "$ARGUMENTS", or, if none are
   named, on every node that isn't `fresh`, in the order listed (dependencies
   come first).
2. For each node, in that order, run the `ail-leaf-compiler` subagent with the
   prompt `Compile <Node>`. It sees only `ail_context` and `ail_submit`, which
   keeps every node encapsulated. Nodes don't depend on each other's
   implementations, so you may run nodes in parallel once the nodes they `use`
   are done.
3. Never write generated files yourself, and never answer a `STOP:` question
   in code. Collect the questions.
4. Finish with `ail_verify`. Report each node as compiled, fresh, rejected
   (with the failing checks) or stopped (with the question the spec must answer).
