# AIL: Agentic Intermediate Language

> People review the spec. Agents compile it. Machines check that the two agree.

## 1. The problem

When agents write most of the code, reviewing the code stops being the best
use of a reviewer's time. What a reviewer needs to see is **why** something
exists, **what** it does and **how** the important decisions were made. All
of that should be precise enough that any model, at any temperature and from
any vendor, produces software that behaves the same.

Models are not deterministic, and no prompt will make them so. AIL's answer:

1. **Leave the model nothing important to decide.** Every degree of freedom is
   fixed by the spec, the profile, the catalog or a golden example, or it is
   explicitly listed as `free`.
2. **Never trust, always verify.** Generated code is accepted only if it passes
   every check the spec implies. The IL is the oracle; the model is a search
   procedure.
3. **Find ambiguity before users do.** Sample the compiler several times,
   across vendors. If the samples disagree, the spec has a hole, and the report
   says where.
4. **Never compile the same thing twice.** Content hashes plus a lock file mean
   that an unchanged node keeps its verified code, so it can't drift.

## 2. The node

Everything is one recursive shape, from the product down to a button:

```ail
node Name : kind   level: product|experience|system|specialist   @tags
  why       rationale, traced to an ancestor with  <- Ancestor
  what      observable contract: claims, scenarios, examples, probes
  how       decide … because … rejected … because …
  look      visual expression in catalog tokens and components
  copy      every user-visible string, verbatim
  binds     props, state, events: how a view connects to logic
  free      [ the only things the compiler may choose ]
  uses      dependencies (only their `what` is visible)
  children  refinement (the review tree)
  verify    properties needing a derived check
```

Two graphs live in one file:

- **children** form the *review tree*. A parent's claims are refined by its
  descendants (`refined-by:`). You read top-down and stop where the detail
  stops mattering to you.
- **uses** form the *dependency graph*. A node sees only the `what` of the
  nodes it uses, never their `how`. That is encapsulation, enforced by the
  compiler rather than by convention.

## 3. Levels: one tree, many readers

| level | reader | allowed language |
|---|---|---|
| product | anyone | plain sentences; every claim `refined-by` a descendant |
| experience | design, QA, product | glossary terms, Given/When/Then, look and copy |
| system | generalist engineers | types, contracts, `expr => expected`, decisions |
| specialist | experts | invariants, algorithms, proofs |

Readability and precision don't compete, because they live at different
depths:

- Plain claims are **proven by children**. *"The computer never loses"* is a
  product sentence; the specialist node `ComputerPlayer` makes it true, and a
  derived check enumerates every game to prove it.
- `ail lint` enforces the vocabulary. Jargon from the profile's list, or code
  notation (calls, operators, camelCase, braces), in `product`/`experience`
  prose is an error. Notation belongs in `look`, `copy` or `binds`, or one
  level deeper.
- A **glossary** gives each domain word a plain meaning and a formal one, so
  upper levels stay readable without becoming ambiguous.
- **Lenses** render the same source for each audience: `stakeholder`,
  `design`, `engineer`, and `specialist --tag <x>`.

## 4. How the output becomes deterministic

| Lever | Mechanism |
|---|---|
| Profiles | Every default (language, framework, file layout, naming, styling, exports, comments) is fixed once at the root and inherited. |
| Closed vocabularies | Design tokens, catalog components, `copy` keys. "A bit of padding" becomes `space.4`. |
| Executable `what` | `expr => expected` examples are translated mechanically into tests. Scenarios and `verify` items become derived checks, generated once, reviewed, and pinned to a hash of the spec. |
| Explicit freedom | Anything not in `free` must follow from the spec. Otherwise the compiler replies `STOP: <question>` instead of guessing. |
| Golden examples | A few node → code pairs per kind anchor structure and style more strongly than written rules can. |
| Encapsulated context | Each leaf is compiled from a small, fixed slice of the spec. A smaller context means less variance. |
| Content hashing | Canonical forms ignore comments, whitespace and section order. Cosmetic edits never recompile anything; changing a dependency's `how` doesn't recompile its dependants. |
| Divergence sampling | `ail diverge` compares N samples × M models on verification, export surface and `probes`. |
| Drift detection | Hand edits to generated code are caught by the lock file. A hook blocks them, CI fails on them, and `ail lift` turns them back into a spec change. |

## 5. The toolchain: skills teach, tools decide, hooks enforce

| Piece | Job |
|---|---|
| `ail` CLI (Bun) | lint, plan, context, verify, compile, submit, derive, diverge, lens, review, lift, glue |
| MCP server | the same operations as tools, so any MCP-capable agent can drive them |
| Skills | `ail-author`, `ail-compile-leaf`, `ail-derive-checks`, `ail-review`, `ail-lift`, plus one per profile |
| Hooks | block edits to generated files; lint every `.ail.md` edit |
| Commands | `/ail-new`, `/ail-compile`, `/ail-lens`, `/ail-review` |
| GitHub Action | lint, `plan --check`, verify, and the IL review in the job summary |

The compile loop is ordinary code, so it behaves the same whichever vendor
fills in the leaves:

```
for node in dependency order:
  if lock[node] == hash(context(node)): skip          # cache hit
  reply = model(skill, context(node))                 # any vendor
  if reply is STOP(question): report it — the spec must answer
  submit: write → verify → lock, or roll back and retry with the failures
```

Glue that needs no judgement (design-token CSS, the entry point, catalog
components) is rendered from templates without any model call.

## 6. Evidence so far

All of this is in this repository and can be re-run:

- **The kata compiles and verifies end to end.** `examples/tictactoe`: 9
  compiled nodes plus glue. 24 example tests and 16 derived checks pass (40 in all),
  including an exhaustive "computer never loses" proof and a typecheck. The app
  runs with `bun run dev`.
- **A real model passes on the first try.** In a scratch copy, `ail compile
  ComputerPlayer --force --model "command:claude -p"` produced a textually
  different implementation (negamax instead of a min/max split) that passed the
  same checks on attempt 1.
- **Real samples converge.** `ail diverge ComputerPlayer Rules --samples 2`
  converged: every sample verified and every probe agreed.
- **Ambiguity becomes a question, not a coin flip.** With the tie-break rule
  removed from `ComputerPlayer`, all 3 samples refused to guess. Each replied
  `STOP:` and asked which index wins when several moves score the same.

## 7. Open questions

- **Probes for views.** `diverge` compares views on verification and export
  surface. Rendering the DOM for probes is the next step.
- **Derived checks are a trust boundary.** They are generated once and then
  pinned. They should get their own review lens, because they decide what
  "correct" means.
- **Multi-file nodes.** Today one node maps to one module. Some targets need a
  node to own a set of files.
- **More profiles.** A backend profile (HTTP + database) would test whether the
  approach holds outside the UI.
- **Self-hosting.** Specifying the `ail` toolchain in AIL would be a real test
  of the format.
