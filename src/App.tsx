import React, { useEffect, useState } from "react";
import BoardComponent from "./components/BoardComponet";
import { Board } from "./models/board";
import { Player } from "./models/player";
import { Colors } from "./models/colors";
import LostFigures from "./components/lostFigures";
import Timer from "./components/Timer";

const App = () => {
  const [board, setBoard] = useState(new Board());
  const [whitePlayer] = useState(new Player(Colors.WHITE));
  const [blackPlayer] = useState(new Player(Colors.BLACK));
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
    <div className="w-screen h-screen bg-gray-900 text-white flex items-center justify-center gap-x-6 px-4">
      {/* Таймер слева */}
      <div className="mr-5">
        <Timer restart={restart} currentPlayer={currentPlayer} />
      </div>

      {/* Доска по центру */}
      <div className="mx-5">
        <BoardComponent
          board={board}
          setBoard={setBoard}
          currentPlayer={currentPlayer}
          swapPlayer={swapPlayer}
        />
      </div>

      {/* Потерянные фигуры справа */}
      <div className="flex flex-col gap-6">
        <LostFigures title="♟ Черные фигуры" figures={board.lostBlackFigures} />
        <LostFigures title="♙ Белые фигуры" figures={board.lostWhiteFigures} />
      </div>
    </div>
  );
};

export default App;
