# Mini fixture

```ail
target
  code       TypeScript 5 strict, named exports only
  path.data  src/gen/{dir}/{kebab}.ts
  path.fn    src/gen/{dir}/{kebab}.ts
  path.view  src/gen/{dir}/{kebab}.tsx
  path.flow  src/gen/{dir}/{kebab}.tsx
  generated  src/gen/**
```

More nodes, each in a folder of its own: [`Add`](add/add.ail.md), [`Pick`](pick/pick.ail.md).

```ail
node Calc : system   level: product
  why   People need to work with numbers.
  what
    1. You can add two numbers.         refined-by: Add
    2. You can find the biggest value.  refined-by: Pick
  children  Add, Pick
```
