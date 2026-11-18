---
name: ail-review
description: Review a change to an AIL spec at the right level of detail, or prepare one for human reviewers. Use for pull requests that touch *.ail.md files, or when asked to explain or summarise an AIL change.
---
# Reviewing AIL changes

Reviewers approve the IL; the generated code is checked by machines. A
review is about intent, contract and decisions, not about code style.

1. Run `ail review --base <base-ref>` (or the `ail_review` tool). It lists the
   nodes whose meaning changed (cosmetic edits are ignored), grouped by level,
   each with its why chain.
2. Route each group to its audience: product to stakeholders, experience to
   design and QA, system to engineers, specialist to the tagged experts
   (`ail lens specialist --tag <tag>`).
3. For each changed node, check:
   - **why**: does it still trace to its parent's goal, and is the change justified?
   - **what**: is every new behaviour pinned by an example or scenario? Is any
     tie-break missing? Would two compilers agree?
   - **how**: does every decision have a `because`, and are the real
     alternatives recorded as `rejected`?
   - **free**: did the whitelist grow, and is that acceptable?
   - **refinement**: is every product claim still `refined-by` a node that proves it?
4. Make sure `ail lint`, `ail plan` (nothing stale) and `ail verify` pass. For
   risky nodes, ask for `ail diverge <Node> --model A --model B`.
5. Don't comment on generated code. If it is wrong, the spec or its checks are
   missing something, so comment on the IL.
