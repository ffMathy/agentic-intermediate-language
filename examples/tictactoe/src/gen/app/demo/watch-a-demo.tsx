import { useEffect, useReducer } from "react";
import { StatusLine } from "../../board/status-line";
import { BoardView } from "../../board/board-view";
import { initial } from "../../engine/game-state";
import { reduce } from "../../engine/game-reducer";
import { choose } from "../../engine/computer-player/computer-player";
import { Stack } from "../../ui/stack";
import { Button } from "../../ui/button";

/** the computer plays both marks, one move every 600 ms, starting with X */
export function WatchADemo() {
  const [game, dispatch] = useReducer(reduce, initial());

  useEffect(() => {
    if (game.status.kind !== "playing") {
      return;
    }
    const timer = setTimeout(() => {
      dispatch({ type: "place", index: choose(game.board, game.next) });
    }, 600);
    return () => {
      clearTimeout(timer);
    };
  }, [game]);

  return (
    <Stack dir="v" gap="space.4" align="center" style={{ width: "100%" }}>
      <StatusLine status={game.status} next={game.next} />
      <BoardView
        board={game.board}
        status={game.status}
        locked={true}
        onPlace={() => {}}
      />
      {game.status.kind !== "playing" && (
        <Button
          variant="secondary"
          onPress={() => dispatch({ type: "newGame" })}
        >
          Watch again
        </Button>
      )}
    </Stack>
  );
}
