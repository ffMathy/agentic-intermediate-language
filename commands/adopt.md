---
description: Bring an existing app under AIL - write its spec from its people, its tickets, its running app and its code, then prove the spec describes it
argument-hint: "<url of the running app> [where its code is] [what to start with]"
---
Bring an existing app under AIL, in reverse: the app exists, and you write
the spec that describes it. Work on one slice at a time (a screen, a flow or a
rule), never the whole app at once. Arguments: "$ARGUMENTS". Ask for the app's
URL or code if they're missing.

Follow the `ail` skill for how nodes are written. On top of it:

1. **Why: from people and tickets.** Search the task tracker your connectors
   reach (Asana, Jira, Linear, GitHub issues), plus PR descriptions, commit
   messages and docs, for the reasons behind the slice. Then ask the user
   about what is still unclear, a few questions at a time, the way you would
   interview its owner. Write each reason into a `why`. A reason nobody can
   confirm is written as `because "unknown, confirm with the owner"`: never
   invent one. The build lists these until someone answers them.
2. **What: from the running app.** Drive the app in a browser (Playwright)
   through the slice: every screen, control, message and error path. Write
   what you see as scenarios, with the exact text on screen in `copy` and the
   layout in `look`. Record behaviour as it is, quirks included. If something
   looks like a bug, keep it, and add a `because "unknown, confirm with the
   owner"` asking whether to keep it.
3. **How: from the code.** Read the code behind the slice for what the
   screen doesn't show: data shapes, rules, edge cases, tie-breaks, timing.
   Turn real inputs and outputs into `expr => expected` examples, and the
   decisions worth keeping into `how`.
4. **Sources.** Give each node a `sources` section listing where its claims
   came from: ticket links, interview answers (who, and when), screens, and
   code paths. It is kept for review and never compiled.
5. **Prove it on the old app.** For each flow, write an end-to-end check at
   `checks/e2e/<the node's folder>/<node in kebab-case>.e2e.ts`: a
   `bun:test` file that drives the app with Playwright at
   `process.env.AIL_APP_URL`, with one test per scenario, named exactly as the
   scenario. Use only what a user can see and do, such as roles, names and
   visible text, never the old app's code or markup. Call `ail_adopt` with the
   app's URL. A failing check means the spec, or the check, is wrong about the
   app: fix that, never the app. When it passes, the spec describes the app.
6. **Report.** Report the nodes written, what `ail_adopt` says, and every
   open question, each with who could answer it.

To move to another technology afterwards, change the root's `target`, run
`/ail:build`, start the new app, and call `ail_adopt` with its URL. The same
checks prove that it behaves like the old one.
