```ail
target
  code       TypeScript 5 strict, named exports only
  path.data  src/gen/{dir}/{kebab}.ts
  path.fn    src/gen/{dir}/{kebab}.ts
  path.view  src/gen/{dir}/{kebab}.tsx
  path.flow  src/gen/{dir}/{kebab}.tsx
  generated  src/gen/**
```

```ail
node Shop : system   level: product
  why   People buy things here.
  what
    1. Prices are shown in whole kroner everywhere.   refined-by: Price
  children  AreaA, AreaB
```
