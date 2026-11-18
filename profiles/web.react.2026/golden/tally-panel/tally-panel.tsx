import { useReducer } from "react";
import { Button, Stack, Text } from "./catalog";
import { tally } from "./tally";

/** TallyPanel: count guests at the door; add one, or start over. */
export function TallyPanel() {
  const [count, dispatch] = useReducer(tally, 0);
  return (
    <Stack dir="v" gap="space.4" align="center" pad="space.6">
      <Text variant="title">{count}</Text>
      <Button variant="primary" size="lg" onPress={() => dispatch({ type: "increment" })}>
        Add guest
      </Button>
      <Button variant="secondary" onPress={() => dispatch({ type: "reset" })}>
        Reset
      </Button>
    </Stack>
  );
}
