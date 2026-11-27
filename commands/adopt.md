---
description: Bring an existing app under AIL - write its spec from its people, its tickets, the running app and its code, then prove the spec describes it
argument-hint: "[where the app's code is] [a part to adopt, or none for the whole app]"
---
Bring an existing app under AIL, in reverse: the app exists, and you write
the spec that describes it. Adopt the whole app, unless the arguments or the
user name a part of it: then adopt only that part. Either way, work through it
one slice at a time (a screen, a flow or a rule), taking each slice through the
steps below and proving it before starting the next, and keep going until
every part is covered. Arguments: "$ARGUMENTS": where the app's code is, and
optionally the part to adopt. Ask where the app's code is if that's missing.

Follow the `ail` skill for how nodes are written. On top of it:

0. **Find out how to run it.** Work out for yourself what kind of app it is
   (web, mobile, desktop, CLI or API) and how it starts. Look in its README,
   package scripts, Makefile, Dockerfile and compose files, CI config, and
   Xcode or Gradle projects. Start it and see it run. Then record that in
   `ail.config.json` under `run.legacy`:
   - `start`: the shell command
   - `cwd`: where to run it, relative to the AIL project
   - `ready`: a URL that answers, or a shell command that exits 0 once the app
     is up, such as a simulator's boot status
   - `timeout`: how long to wait, in seconds
   - `env`: what the checks need to reach the app, such as `AIL_APP_URL`, a
     device id or a binary's path

   Also start what it depends on: a backend, a database, a queue, another
   service. Find each in its README, compose files, scripts and config, and
   record it under `run.legacy.services` (each with `start`, `cwd`, `ready`
   and `env`, started in order before the app). If something can't run
   locally yet, make it possible: add what's missing, such as a compose file
   for its database, a local config or a start script, as development tooling
   next to the app. Ask only for what this machine truly lacks, such as a
   simulator, a device or a secret, and say exactly what.

   Test data belongs to the use case, and the scenario already says what it
   is: its Given. When the outcome depends on the values, write them into the
   Given ("Given a basket with a 199 kr lamp and a 499 kr rug, Then the total
   reads 698 kr"). When it doesn't, leave them out and let the test choose.
   Each end-to-end test creates its own scenario's data at its start, through
   the program's official interface: its HTTP API, its CLI or its import
   feature. Use shared helpers in the checks folder (for example
   `checks/e2e/data.ts`). Never write to the
   database directly: data made the way users make it is valid, passes the
   app's own rules, and keeps working when the storage changes. Only what every
   scenario needs, such as a user to log in as, goes in `run.legacy.seed`, a
   command that runs once the app is ready, through the same official
   interface.
1. **Why: from people and tickets.** Search the task tracker your connectors
   reach (Asana, Jira, Linear, GitHub issues), plus PR descriptions, commit
   messages and docs, for the reasons behind the slice. Then ask the user
   about what is still unclear, a few questions at a time, the way you would
   interview its owner. Write each reason into a `why`. A reason nobody can
   confirm is written as `because "unknown, confirm with the owner"`: never
   invent one. Every build lists these until someone answers them.
2. **What: from the running app.** Drive the app through the slice with
   whatever suits its platform:
   - Playwright for the web
   - Appium, Maestro or XCUITest/Espresso on a simulator or emulator for
     mobile
   - a spawned process for a CLI
   - HTTP for an API

   Go through every screen, control, message and error path. Write what you
   see as scenarios, with the exact text in `copy` and the layout in `look`.
   Record behaviour as it is, quirks included. If something looks like a bug,
   keep it, and add a `because "unknown, confirm with the owner"` asking
   whether to keep it.
3. **How: from the code.** Read the code behind the slice for what the app
   doesn't show: data shapes, rules, edge cases, tie-breaks, timing. Turn real
   inputs and outputs into `expr => expected` examples, and the decisions worth
   keeping into `how`. Write it all in AIL notation
   ([docs/language.md](../docs/language.md)), never in the old app's
   language: its interfaces become `type Name = { … }` records, its types
   become `text`, `integer`, `list of T`, `T or nothing` and `later T`, its
   null becomes `nothing`, and its lambdas and query chains become words.
   The spec must compile just as well to another language, which is the point
   of a migration.
4. **Sources.** Give each node a `sources` section listing where its claims
   came from: ticket links, interview answers (who, and when), screens, and
   code paths. It is kept for review and never compiled.
5. **Prove it on the old app.** For each flow, write an end-to-end check in
   the target's language, with the test framework its `tests` setting names
   (xUnit for C#, pytest for Python, `bun:test` for TypeScript):
   - one test per scenario, named exactly as the scenario (in xUnit, its
     `DisplayName`)
   - it drives the app with the same tool as step 2, and reaches it through
     the `env` in `run`
   - it uses only what a user can see and do, never the old app's code or
     markup, so that it also works against the rebuilt app
   - it lives at `checks/e2e/<the node's folder>/<node in kebab-case>.e2e.ts`
     for a TypeScript target. For any other language, say where in
     `ail.config.json` under `tests`, and how to run one:

     ```json
     "tests": {
       "e2e": "checks/e2e/{dir}/{name}Checks.cs",
       "prepare": "dotnet build checks/e2e -c Release",
       "command": "dotnet checks/e2e/bin/Release/net10.0/Checks.dll -class '*.{name}Checks' -result-junit {report}"
     }
     ```

     `{dir}`, `{name}` and `{kebab}` are the node's folder and name; the
     command also gets `{file}` (the check) and `{report}`, where it writes a
     JUnit or TRX report, from which ail reads each test's name and outcome.
     `prepare` builds the checks once before they run. (The derived checks
     `ail build` writes follow the target's `checks.path` and `checks.run`.)

   - it takes no screenshots: it proves behaviour only. What the app looks
     like is pictured by the derived checks (below).

   Add any driver it needs to the checks' own dependencies. Call `ail_adopt`:
   it starts the app's services and the app as `run.legacy` says, runs its
   baseline seed, runs the checks, and stops the app. A failing check means
   the spec or the check is wrong about the app: fix that, never the app.
   Then `/ail:build` pictures every node with a `look`: its code is the
   app's own, so ail builds nothing for it, but derives a check that renders
   that code and saves each scenario's final screen beside the node's spec,
   in `shots/`, and a model compares them with the `look`. Say in the
   target's `test harness` how a check renders a view without a display and
   saves a PNG (a headless browser for the web, the UI toolkit's headless
   mode for a desktop app). When everything
   passes, the spec describes the app, and `ail_adopt` records every node in
   the lock file as built by the existing app, and records `run.app` as a copy
   of `run.legacy`: the existing app is what `ail build` makes until the target
   changes. A later `/ail:build` then only builds what changes, and runs every
   end-to-end check against the app.
6. **Report.** Report the nodes written, what `ail_adopt` says, and every
   open question, each with who could answer it. If `ail_adopt` suggests
   `.gitattributes` lines, ask the user whether to add them. They keep the
   generated code out of pull request diffs while it stays committed, so
   review is of the spec. If the user agrees, add them to the `.gitattributes`
   at the repository's root.

To move to another technology afterwards:
1. Change the root's `target` and run `/ail:build`.
2. Find out how the new app starts, and point `run.app` at it (until then it
   starts the existing app).
3. From then on, every build runs the same checks against the new app, which
   proves it behaves like the old one.
