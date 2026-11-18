# Mini fixture

```ail
use profile web.react.2026
```

```ail
node Calc : system   level: product
  why   People need to work with numbers.
  what
    1. You can add two numbers.         refined-by: Add
    2. You can find the biggest value.  refined-by: Pick
  children  Add, Pick
```

```ail
node Add : fn   level: system
  why   Addition.   <- Calc
  what
    add(a: number, b: number) -> number
    examples
      add(1, 2) => 3
      add(-1, 1) => 0
  how
    decide plain addition
      because nothing else is needed
      rejected a lookup table because it is silly
```

```ail
node Pick : fn   level: system
  why   Choose the biggest item.   <- Calc
  what
    pick(xs: number[]) -> number    — the index of the largest value
    examples
      pick([1, 5, 2]) => 1
    probes
      pick([3, 3])
  uses  Add
```
