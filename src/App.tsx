import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import { Board } from "./models/board";
import { BoardComponent } from "./components/BoardComponet";
import { Player } from "./models/player";
import { Colors } from "./models/colors";
import { LostFigures } from "./components/lostFigures";
import { Timer } from "./components/Timer";
function App() {
  const [board, setBoard] = useState(new Board());
  const [whitePlayer, setwhitePlayer] = useState(new Player(Colors.WHITE));
  const [blackPlayer, setblackPlayer] = useState(new Player(Colors.BLACK));
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  useEffect(() => {
    restart();
    setCurrentPlayer(whitePlayer);
  }, []);
  function restart() {
    const newBoard = new Board();
    newBoard.initCells();
    newBoard.addFigures();
    setBoard(newBoard);
  }
  function swapPlayer() {
    setCurrentPlayer(
      currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer
    );
  }
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <BoardComponent
        board={board}
        setBoard={setBoard}
        currentPlayer={currentPlayer}
        swapPlayer={swapPlayer}
      />
      <div>
        <Timer restart={restart} currentPlayer={currentPlayer} />
        <LostFigures title={"black fidures"} figures={board.lostBlackFigures} />
        <LostFigures title={"white fidures"} figures={board.lostWhiteFigures} />
      </div>
    </div>
  );
}

export default App;
