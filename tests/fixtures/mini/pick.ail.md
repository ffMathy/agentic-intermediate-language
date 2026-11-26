# Pick

```ail
node Pick : fn   level: system
  why   Choose the biggest item.   <- Calc
  what
    pick(xs: list of number) -> integer — the index of the largest value
    examples
      pick([1, 5, 2]) => 1
    probes
      pick([3, 3])
  uses  Add
```
