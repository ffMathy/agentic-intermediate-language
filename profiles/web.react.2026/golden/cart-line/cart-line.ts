/** type Money = { minor: number } — integer minor units. */
export type Money = { minor: number };

/** type CartLine = { sku, title, unitPrice, quantity } */
export type CartLine = { sku: string; title: string; unitPrice: Money; quantity: number };

/** lineTotal(line) = unitPrice × quantity */
export function lineTotal(line: CartLine): Money {
  return { minor: line.unitPrice.minor * line.quantity };
}
