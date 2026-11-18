import { useState } from "react";
import { Segmented, Stack } from "../catalog";
import { WatchADemo } from "./demo/watch-a-demo";
import { PlayAGame } from "./play/play-a-game";

/** App: two areas, "Play" and "Watch", picked with one control named "Mode"; each starts fresh when picked. */
export function App() {
  const [area, setArea] = useState<"play" | "watch">("play");
  return (
    <div style={{ width: "100%", maxWidth: "360px", margin: "0 auto", background: "var(--color-surface)" }}>
      <Stack dir="v" gap="space.4" align="stretch" pad="space.6">
        <Segmented
          label="Mode"
          width="fill"
          options={[
            { value: "play", label: "Play" },
            { value: "watch", label: "Watch" },
          ]}
          value={area}
          onChange={setArea}
        />
        {area === "play" ? <PlayAGame /> : <WatchADemo />}
      </Stack>
    </div>
  );
}
