---
description: Compile stale AIL nodes in this session, with you as the leaf compiler
argument-hint: "[Node ...]"
---
Compile the AIL project in this session. You are the model that fills in the leaves.

1. Call `ail_plan`. Work on the nodes named in "$ARGUMENTS", or, if none are named, on every node that isn't `fresh`, in the order listed (dependencies come first).
2. For each node, start a subagent whose only input is the output of `ail_context` for that node, together with the instructions of the `ail-compile-leaf` skill. Each subagent gets a fresh context, which keeps every node encapsulated. The subagent replies with the file contents, or with `STOP: question`.
3. Hand the contents to `ail_submit`. If it is rejected, give the failures back to the same subagent, at most twice.
4. Do not edit files under the generated paths yourself. Do not answer a STOP question in code: collect the questions.
5. Finish with `ail_verify`. Report, per node: compiled, fresh, rejected (with the failing checks), or stopped (with the question the spec must answer).
