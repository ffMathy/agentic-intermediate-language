# Add

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
