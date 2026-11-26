import { useEffect, useReducer } from "react";
import { ChooseOpponent } from "./choose-opponent/choose-opponent";
import { StatusLine } from "../../board/status-line/status-line";
import { BoardView } from "../../board/board-view/board-view";
import { NewGameButton } from "./new-game-button/new-game-button";
import { initial } from "../../engine/game-state/game-state";
import type { Opponent } from "../../engine/game-state/game-state";
import { reduce } from "../../engine/game-reducer/game-reducer";
import { choose } from "../../engine/computer-player/computer-player";
import { Stack } from "../../ui/stack/stack";

/** Make the game understandable without instructions. */
export function PlayAGame() {
  const [game, dispatch] = useReducer(reduce, undefined, () => initial());

  const thinking =
    game.opponent === "computer" &&
    game.next === "O" &&
    game.status.kind === "playing";

  useEffect(() => {
    if (thinking) {
      const timer = setTimeout(() => {
        dispatch({ type: "place", index: choose(game.board) });
      }, 300);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [game, thinking]);

  return (
    <Stack dir="v" gap="space.4" align="center" style={{ width: "100%" }}>
      <ChooseOpponent
        opponent={game.opponent}
        onChange={(o: Opponent) => dispatch({ type: "setOpponent", opponent: o })}
      />
      <StatusLine status={game.status} next={game.next} />
      <BoardView
        board={game.board}
        status={game.status}
        locked={thinking}
        onPlace={(i: number) => dispatch({ type: "place", index: i })}
      />
      <NewGameButton onPress={() => dispatch({ type: "newGame" })} />
    </Stack>
  );
}
