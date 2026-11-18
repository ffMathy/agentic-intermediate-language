import { Segmented } from "./catalog";
import type { Opponent } from "./game-state";

/** ChooseOpponent: two options, "Friend" and "Computer", named together as "Opponent". */
export function ChooseOpponent(props: { opponent: Opponent; onChange: (opponent: Opponent) => void }) {
  return (
    <Segmented
      label="Opponent"
      width="fill"
      options={[
        { value: "friend", label: "Friend" },
        { value: "computer", label: "Computer" },
      ]}
      value={props.opponent}
      onChange={props.onChange}
    />
  );
}
