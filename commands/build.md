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
