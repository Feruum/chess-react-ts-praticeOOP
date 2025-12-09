import "./App.css";
import { useState, useEffect } from "react"; // Объединил импорты
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

  // !!! ДОБАВЛЕНА ЭТА СТРОКА !!!
  const [winner, setWinner] = useState<Colors | null>(null);

  useEffect(() => {
    restart();
    setCurrentPlayer(whitePlayer);
  }, []);

  function restart() {
    const newBoard = new Board();
    newBoard.initCells();
    newBoard.addFigures();
    setBoard(newBoard);
    // !!! СБРОС ПОБЕДИТЕЛЯ ПРИ РЕСТАРТЕ !!!
    setWinner(null);
    setCurrentPlayer(whitePlayer); // Лучше явно сбросить ход на белых
  }

  function swapPlayer() {
    const nextPlayerColor =
      currentPlayer?.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;

    // Проверка на мат
    if (board.isCheckmate(nextPlayerColor)) {
      setWinner(currentPlayer?.color || null); // Устанавливаем победителя
      // alert можно убрать, если будете выводить текст в интерфейсе
      // alert(`Мат! Победили ${currentPlayer?.color}`);
      return;
    }

    setCurrentPlayer(
      nextPlayerColor === Colors.WHITE ? whitePlayer : blackPlayer
    );
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col">
      {" "}
      {/* flex-col чтобы заголовок был сверху */}
      {/* ОТОБРАЖЕНИЕ ПОБЕДИТЕЛЯ */}
      {winner && (
        <div className="absolute top-10 text-3xl font-bold text-red-600 bg-white p-4 rounded shadow-lg z-50">
          Мат! Победили {winner}
        </div>
      )}
      <div className="flex">
        <BoardComponent
          board={board}
          setBoard={setBoard}
          currentPlayer={currentPlayer}
          swapPlayer={swapPlayer}
        />
        <div className="ml-10">
          {" "}
          {/* Отступ для панели справа */}
          <Timer restart={restart} currentPlayer={currentPlayer} />
          <LostFigures
            title={"Black figures"}
            figures={board.lostBlackFigures}
          />
          <LostFigures
            title={"White figures"}
            figures={board.lostWhiteFigures}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
