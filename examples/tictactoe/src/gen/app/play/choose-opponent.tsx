import type { Opponent } from "../../engine/game-state";
import { Segmented } from "../../ui/segmented";

/** two options, "Friend" and "Computer", named together as "Opponent" */
export function ChooseOpponent({
  opponent,
  onChange,
}: {
  opponent: Opponent;
  onChange: (opponent: Opponent) => void;
}) {
  return (
    <Segmented
      label="Opponent"
      options={[
        { value: "friend", label: "Friend" },
        { value: "computer", label: "Computer" },
      ]}
      value={opponent}
      onChange={(value: Opponent) => onChange(value)}
    />
  );
}
