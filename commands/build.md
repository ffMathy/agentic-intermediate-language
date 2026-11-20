---
description: Build the AIL spec, then check everything (no API key needed)
argument-hint: "[Node ...]"
---
Call `ail_build` with `nodes` set to the node names in "$ARGUMENTS" (none
means every node that changed). It can take minutes. Then report, briefly:
- which nodes were compiled, and which failed and why
- any `STOP:` question: the spec must answer it. Propose the spec change, and
  never answer it in code
- the result of the check

If the result suggests `.gitattributes` lines (it does on a project's first
build), ask the user whether to add them. They keep the generated code out of
pull request diffs while it stays committed, so reviewers read the spec. If the
user agrees, add the lines to the `.gitattributes` at the repository's root.

If the result says the end-to-end checks were not run because there is no
`run.app`, find out how the app this project builds is started, along with what it
depends on (a backend, a database). Look at the target, its package scripts
and its build files. Then record it in `ail.config.json` under `run.app`:
`start`, `cwd`, `ready`, `env`, its `services`, and a `seed` for the baseline
data every scenario needs, created through the app's own API, never directly
in its database, as `/ail:adopt` describes. Data for a single scenario comes
from its node's `data` section, and its test creates it. If it can't run locally yet, make it possible. Then
build again. If starting it needs something this
machine lacks, such as a simulator or a device, say exactly what.
