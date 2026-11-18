```ail
node AreaB : fn   level: system
  why   The receipt.   <- Shop
  what
    receiptLine(minor: number) -> string   — "<kroner> kr"
    examples
      receiptLine(1999) => "19 kr"
  uses  Price
```
