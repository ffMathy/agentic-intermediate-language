/** clampQuantity(n, min, max): n rounded down to an integer, then limited to [min, max]. */
export function clampQuantity(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.floor(n)));
}
