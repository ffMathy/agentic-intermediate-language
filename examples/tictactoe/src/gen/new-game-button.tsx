import { Button } from "./catalog";

/** NewGameButton: pressing "New game" asks for a new game, once. */
export function NewGameButton(props: { onPress: () => void }) {
  return (
    <Button variant="secondary" width="auto" onPress={props.onPress}>
      New game
    </Button>
  );
}
