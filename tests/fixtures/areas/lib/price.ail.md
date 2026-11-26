# Price

```ail
node Price : fn   level: system
  why   One rounding rule for every area.   <- Lib
  what
    price(minor: number) -> number    — whole kroner, rounded down
    examples
      price(1999) => 19
```
