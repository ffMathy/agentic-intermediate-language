# Profile `web.react.2026`

Output paths use `{dir}`, the folder of the `.ail.md` file that defines a
node, so generated code mirrors the spec's folders. `library` nodes only
group shared children; they have no path and are never compiled.

A profile fixes every default a model would otherwise pick on its own: language,
framework, file layout, naming, styling, testing. Nodes inherit it, so none of
these choices can vary between vendors or runs.

```ail
profile web.react.2026
  language        TypeScript 5, strict mode, ES modules, no `any`
  runtime         Bun 1.x for tests and the dev server
  ui              React 19 function components only; no class components; no state, routing or styling libraries
  libs            react react-dom
  state           a flow owns exactly the state its `binds.state` names (useReducer for a reducer, useState for a single value) and passes values and callbacks down as props; logic lives in pure fn modules
  effects         only flows may use useEffect, and only for what `binds` names
  styling         inline style objects whose values reference catalog tokens as CSS variables (token a.b.c → "var(--a-b-c)"); a px literal only where `look` gives one
  layout          stack(v|h, gap: t, align: a, pad: t) [ A, B ] → <Stack dir="v" gap="t" align="a" pad="t"><A/><B/></Stack> from the catalog
  components      catalog components only (Text, Button, Segmented, Stack, Spinner); native elements only where `look` describes something the catalog lacks
  naming          identifiers mirror IL names exactly; a view or flow exports a component named exactly like its node; props are named after `binds`
  exports         named exports only, no default exports; export every name `what` mentions and nothing else except types
  copy            user-visible text comes from `copy` verbatim with {placeholders} interpolated; never invent text
  a11y            every interactive element is keyboard reachable and has an accessible name
  comments        one JSDoc line per export quoting the IL clause it implements; no other comments
  formatting      2-space indent, double quotes, semicolons, trailing commas in multi-line literals
  path.data       src/gen/{dir}/{kebab}.ts
  path.fn         src/gen/{dir}/{kebab}.ts
  path.view       src/gen/{dir}/{kebab}.tsx
  path.flow       src/gen/{dir}/{kebab}.tsx
  catalog-module  src/gen/catalog/index.tsx
  tokens-css      src/gen/tokens.css
  generated       src/gen/** index.html
  tests           bun test, @testing-library/react, happy-dom
```

## Catalog

Tokens become CSS variables in `src/gen/tokens.css`; components live in the
glue module `src/gen/catalog/index.tsx`. Projects may add tokens with their own
`catalog` block.

```ail
catalog
  tokens
    space.1=4px  space.2=8px  space.3=12px  space.4=16px  space.6=24px
    radius.md=8px  radius.full=999px
    font.body=16px  font.status=18px  font.title=28px  font.mark=40px
    color.surface=#ffffff  color.surface.raised=#f3f4f6  color.border=#d1d5db
    color.text=#111827  color.text.muted=#6b7280
    color.action=#111827  color.action.text=#ffffff
    color.focus=#2563eb
  components
    Stack  Text.title  Text.status  Text.mark  Text.body
    Button.primary  Button.primary.lg  Button.secondary
    Segmented  Spinner.sm
```

## Jargon

Words that may not appear in `product` or `experience` nodes unless the
project's glossary defines them.

```ail
jargon
  reducer minimax memoize memoized memoization idempotency idempotent
  endpoint api json http regex callback async await mutex schema enum
  boolean null undefined array hook props dispatch payload render
  "state machine" "pure function" "race condition" "dependency injection"
```
