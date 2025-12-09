import React, { useEffect } from "react";
import { CellComponent } from "./CellComponent";
import { Board } from "../models/board";
import { useState } from "react";
import { Cell } from "../models/cell";
import { Player } from "../models/player";

interface BoardProps {
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  swapPlayer: () => void;
}
export function BoardComponent({
  board,
  setBoard,
  currentPlayer,
  swapPlayer,
}: BoardProps) {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  function click(cell: Cell) {
    if (
      selectedCell &&
      selectedCell !== cell &&
      selectedCell.figure?.canMove(cell)
    ) {
      selectedCell.moveFigure(cell);

      // 👉 Проверка шах/мат сразу после хода
      board.checkGameState(currentPlayer!.color);

      updateBoard();

      // 👉 Если игра закончена — дальше ходить нельзя
      if (board.isGameOver) {
        alert(`Game Over! Winner: ${board.winner}`);
        return;
      }

      swapPlayer();
      setSelectedCell(null);
    } else {
      if (cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell);
      }
    }
  }
  useEffect(() => {
    hightLightCells();
    updateBoard();
  }, [selectedCell]);
  function hightLightCells() {
    board.highlightCells(selectedCell);
  }
  function updateBoard() {
    const newBoard = board.getCopyBoard();
    setBoard(newBoard);
  }
  return (
    <>
      {/* Текущий игрок */}
      <h3 className="text-xl font-semibold mr-5">
        Current Player:{" "}
        <span
          className={
            currentPlayer?.color === "white" ? "text-blue-400" : "text-red-400"
          }
        >
          {currentPlayer?.color}
        </span>
      </h3>
      <div className="w-[calc(64px*8)] h-[calc(64px*8)] flex flex-wrap  border-gray-700  shadow-xl">
        {board.cells.map((row, index) => (
          <React.Fragment key={index}>
            {row.map((cell) => (
              <CellComponent
                click={click}
                cell={cell}
                key={cell.id}
                selected={
                  cell.x === selectedCell?.x && cell.y === selectedCell?.y
                }
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
