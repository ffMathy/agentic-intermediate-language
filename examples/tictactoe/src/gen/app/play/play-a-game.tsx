import { useEffect, useReducer } from "react";
import { BoardView } from "../../board/board-view";
import { StatusLine } from "../../board/status-line";
import { Stack } from "../../catalog";
import { choose } from "../../engine/computer-player/computer-player";
import { reduce } from "../../engine/game-reducer";
import { initial } from "../../engine/game-state";
import { ChooseOpponent } from "./choose-opponent";
import { NewGameButton } from "./new-game-button";

/** PlayAGame: the game screen; against the computer, it answers after 300 ms while the board is locked. */
export function PlayAGame() {
  const [game, dispatch] = useReducer(reduce, initial());
  const thinking = game.opponent === "computer" && game.next === "O" && game.status.kind === "playing";

  useEffect(() => {
    if (!thinking) return;
    const timer = setTimeout(() => dispatch({ type: "place", index: choose(game.board) }), 300);
    return () => clearTimeout(timer);
  }, [game, thinking]);

  return (
    <Stack dir="v" gap="space.4" align="center" style={{ width: "100%" }}>
      <ChooseOpponent opponent={game.opponent} onChange={(opponent) => dispatch({ type: "setOpponent", opponent })} />
      <StatusLine status={game.status} next={game.next} />
      <BoardView board={game.board} status={game.status} locked={thinking} onPlace={(index) => dispatch({ type: "place", index })} />
      <NewGameButton onPress={() => dispatch({ type: "newGame" })} />
    </Stack>
  );
}
