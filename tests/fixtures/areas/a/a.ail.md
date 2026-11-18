```ail
node AreaA : fn   level: system
  why   The basket.   <- Shop
  what
    basketTotal(items: number[]) -> number   — sum of item prices in whole kroner
    examples
      basketTotal([1999, 100]) => 20
  uses  Price
```
