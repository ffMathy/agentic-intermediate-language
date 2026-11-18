```ail
node ClampQuantity : fn   level: system
  why   A quantity outside the allowed range must never reach the order.   <- Cart
  what
    clampQuantity(n: number, min: number, max: number) -> number
      result is n rounded down to an integer, then limited to [min, max]
    examples
      clampQuantity(3, 1, 9) => 3
      clampQuantity(0, 1, 9) => 1
      clampQuantity(12, 1, 9) => 9
      clampQuantity(2.7, 1, 9) => 2
  free  [ local variable names ]
```
