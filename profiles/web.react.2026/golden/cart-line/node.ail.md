```ail
node CartLine : data   level: system
  why   One product in the cart, with how many the customer wants.   <- Cart
  what
    type Money = { minor: number }                ; integer minor units (øre)
    type CartLine = { sku: string, title: string, unitPrice: Money, quantity: number }
    lineTotal(line: CartLine) -> Money            ; unitPrice × quantity
    examples
      lineTotal({ sku: "a", title: "A", unitPrice: { minor: 1250 }, quantity: 3 }) => ({ minor: 3750 })
```
