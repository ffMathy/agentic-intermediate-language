import { Button, Stack, Text } from "./catalog";
import { clampQuantity } from "./clamp-quantity";

/** QuantityStepper: the current quantity between a minus and a plus button. */
export function QuantityStepper(props: { quantity: number; onChange: (quantity: number) => void }) {
  return (
    <Stack dir="h" gap="space.2" align="center">
      <Button variant="secondary" label="Fewer" onPress={() => props.onChange(clampQuantity(props.quantity - 1, 1, 9))}>
        −
      </Button>
      <span aria-live="polite" style={{ minWidth: "2ch", textAlign: "center" }}>
        <Text variant="body">{props.quantity}</Text>
      </span>
      <Button variant="secondary" label="More" onPress={() => props.onChange(clampQuantity(props.quantity + 1, 1, 9))}>
        +
      </Button>
    </Stack>
  );
}
