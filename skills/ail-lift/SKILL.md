---
name: ail-lift
description: Draft AIL nodes from existing code (decompile). Use to bring an existing codebase under AIL, or to turn a hand edit of generated code back into a spec change.
---
# Lifting code into AIL

Read the code and write the AIL node(s) that would compile back to code that
behaves the same way.

1. Choose `kind` and `level` honestly: a pure function is `fn` at `system`; a
   screen is a `view` at `experience`.
2. **what** comes from observable behaviour: signatures, return values, edge
   cases. Turn the behaviour you can see into `expr => expected` examples,
   using values you have traced through the code.
3. **how** records only decisions a reader can see in the code (an algorithm,
   a data structure, a constant). If the code doesn't show the reason, write
   `because "unknown — confirm"`.
4. **why**: if the code doesn't show it, write `why  TODO: confirm with the owner`.
   Never invent rationale.
5. Follow the vocabulary rules for the level you choose, and use glossary terms.
6. Reply with one ```ail fenced block and nothing else.
