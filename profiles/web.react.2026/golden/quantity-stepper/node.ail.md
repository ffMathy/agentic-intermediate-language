```ail
node QuantityStepper : view   level: experience
  why   Changing how many you buy should take one tap.   <- Cart
  what
    shows    the current quantity between a minus and a plus button
    minus    lowers the quantity by one, never below 1
    plus     raises the quantity by one, never above 9
    a11y     the buttons are named "Fewer" and "More"; the number is announced when it changes
  look
    layout   stack(h, gap: space.2, align: center) [ Button.secondary "−", Text.body quantity, Button.secondary "+" ]
    quantity min-width 2ch, centered
  copy
    stepper.fewer  "Fewer"
    stepper.more   "More"
  binds
    props   quantity: number, onChange(quantity: number)
    minus   onChange(clampQuantity(quantity - 1, 1, 9))
    plus    onChange(clampQuantity(quantity + 1, 1, 9))
  uses  ClampQuantity
```
