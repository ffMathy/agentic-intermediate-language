import { useState } from "react";
import { PlayAGame } from "./play/play-a-game";
import { WatchADemo } from "./demo/watch-a-demo";
import { Stack } from "../ui/stack/stack";
import { Segmented } from "../ui/segmented/segmented";

type Area = "play" | "watch";

const modeOptions: { value: Area; label: string }[] = [
  { value: "play", label: "Play" },
  { value: "watch", label: "Watch" },
];

/** two areas, "Play" and "Watch", picked with one control named "Mode"; "Play" is shown first */
export function App() {
  const [area, setArea] = useState<Area>("play");
  return (
    <Stack
      dir="v"
      gap="space.4"
      align="stretch"
      pad="space.6"
      style={{
        maxWidth: "360px",
        marginLeft: "auto",
        marginRight: "auto",
        background: "var(--color-surface)",
      }}
    >
      <Segmented
        label="Mode"
        options={modeOptions}
        value={area}
        onChange={(a: Area) => setArea(a)}
      />
      {area === "play" ? <PlayAGame /> : <WatchADemo />}
    </Stack>
  );
}
