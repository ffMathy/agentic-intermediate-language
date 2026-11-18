import { useEffect, useReducer } from "react";
import { BoardView } from "./board-view";
import { Stack } from "./catalog";
import { ChooseOpponent } from "./choose-opponent";
import { choose } from "./computer-player";
import { reduce } from "./game-reducer";
import { initial } from "./game-state";
import { NewGameButton } from "./new-game-button";
import { StatusLine } from "./status-line";

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
    <div style={{ width: "100%", maxWidth: "360px", margin: "0 auto", background: "var(--color-surface)" }}>
      <Stack dir="v" gap="space.4" align="center" pad="space.6">
        <ChooseOpponent opponent={game.opponent} onChange={(opponent) => dispatch({ type: "setOpponent", opponent })} />
        <StatusLine status={game.status} next={game.next} />
        <BoardView board={game.board} status={game.status} locked={thinking} onPlace={(index) => dispatch({ type: "place", index })} />
        <NewGameButton onPress={() => dispatch({ type: "newGame" })} />
      </Stack>
    </div>
  );
}
