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
4. Use the test tools the target names. For React targets that is `bun:test`
   with `@testing-library/react` (`render`, `screen`, `fireEvent`, `act`,
   `cleanup`); call `cleanup()` in `afterEach`. Import the module under test
   relative to the check file.
5. Text the spec composes from parts (a colored player mark followed by
   "'s turn", a number next to a label) is split across elements. Never match
   it with `getByText`, which only sees one element's own text. Read the
   `textContent` of the element that contains the whole message instead, for
   example the one with `aria-live`. Likewise, count things (marks on a
   board, items in a list) by role and accessible name, never by short text
   such as "X" that can appear elsewhere on the page.
6. The test DOM (happy-dom) drops CSS functions such as clamp(), min() and
   calc() from inline styles, so never assert on a style value that uses one.
   Assert on plain values (px, vw, %) or on structure and text instead.
7. The first line is the `// ail-derived-from: Node@hash` header you were given.
8. If a scenario can't be checked without guessing, reply with
   `STOP: <question>`.

## Output
    === FILE: checks/<kebab>.test.tsx ===
    <complete file>
    === END ===

Each test sets up exactly the data its scenario's Given describes, with the
values the Given states (choose any sensible values where it states none),
and nothing more. Each test sets up its own data rather than sharing state
with other tests.
