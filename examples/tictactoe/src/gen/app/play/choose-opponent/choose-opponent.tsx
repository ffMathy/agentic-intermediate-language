import type { Opponent } from "../../../engine/game-state/game-state";
import { Segmented } from "../../../ui/segmented/segmented";

const OPTIONS: { value: Opponent; label: string }[] = [
  { value: "friend", label: "Friend" },
  { value: "computer", label: "Computer" },
];

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
      options={OPTIONS}
      value={opponent}
      onChange={onChange}
    />
  );
}
