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

If the result says the end-to-end checks were not run because there is no
`run.app`, find out how the app this project builds is started. Look at the
target, its package scripts and its build files. Then record it in
`ail.config.json` under `run.app` (`start`, `cwd`, `ready`, `env`, as
`/ail:adopt` describes) and build again. If starting it needs something this
machine lacks, such as a simulator or a device, say exactly what.
