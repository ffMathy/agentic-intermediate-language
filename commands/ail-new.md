---
description: Turn a feature request into AIL nodes, top-down
argument-hint: "<what you want built>"
---
Follow the `ail-author` skill to add "$ARGUMENTS" to the AIL spec.

1. Call `ail_tree`, and read the nodes the request touches with `ail_node`.
2. Start at the highest level the request affects. Write the product claim or experience scenario first, in plain language. Then refine it downwards, level by level, until every leaf has examples or scenarios that pin its behaviour.
3. Add glossary terms for any new domain words. Use catalog tokens and components only.
4. Run `ail_lint` and fix every error.
5. Show the user the new and changed nodes through `ail_lens design` (or `engineer` for system-only changes), and ask for approval before compiling.
