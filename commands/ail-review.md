---
description: Review the AIL changes on this branch, routed by level
argument-hint: "[base-ref, default origin/main]"
---
Follow the `ail-review` skill. Run `ail_review` with base = "$ARGUMENTS" (or `origin/main` when no base is given), then `ail_lint`, `ail_plan` and `ail_verify`. Report per level (product, experience, system, specialist):
- what changed, in that level's language
- problems against the skill's checklist
- who should approve it

Do not review generated code.
