---
name: ail-derive-checks
description: Turn an AIL node's scenarios and verify items into a pinned test file (the derived oracle). Use when `ail verify` reports a missing or stale derived check, or when asked to `ail derive` a node.
---
# Derive checks from scenarios

Scenarios (Given/When/Then) and `verify` items describe behaviour that
`expr => expected` examples cannot. You translate them into tests once. The
tests are committed, reviewed and pinned to a hash of the spec, and from then
on they decide what "correct" means for the node, for every model and every
run.

## Rules
1. One `test(...)` per scenario, named exactly like the scenario title. One per
   verify item, named after it.
2. Test only what the scenario states. Don't assert on anything the spec leaves
   `free`, on internal structure, on class names or on styling details that
   aren't in `look`.
3. Find elements the way a user would: by role and accessible name, using the
   `copy` text verbatim (`getByRole("button", { name: "New game" })`).
4. For the web.react.2026 profile, use `bun:test` with `@testing-library/react`
   (`render`, `screen`, `fireEvent`, `act`, `cleanup`) and import the module
   under test relative to the check file. Call `cleanup()` in `afterEach`.
5. The first line is the `// ail-derived-from: Node@hash` header you were given.
6. If a scenario can't be checked without guessing, reply with
   `STOP: <question>`.

## Output
    === FILE: checks/<kebab>.test.tsx ===
    <complete file>
    === END ===
