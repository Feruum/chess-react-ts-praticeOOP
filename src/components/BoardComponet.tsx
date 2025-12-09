import React, { useEffect, useState } from "react";
import { Board } from "../models/board";
import CellComponent from "./CellComponent";
import { Cell } from "../models/cell";
import { Player } from "../models/player";

interface BoardProps {
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  swapPlayer: () => void;
}

export default function BoardComponent({
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
      swapPlayer();
      setSelectedCell(null);
      updateBoard();
    } else {
      if (cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell);
      }
    }
  }

  useEffect(() => {
    highlightCells();
  }, [selectedCell]);

  function highlightCells() {
    board.highlightCells(selectedCell);
    updateBoard();
  }

  function updateBoard() {
    const newBoard = board.getCopyBoard();
    setBoard(newBoard);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Текущий игрок */}
      <h3 className="text-xl font-semibold">
        Текущий игрок:{" "}
        <span
          className={
            currentPlayer?.color === "white" ? "text-blue-400" : "text-red-400"
          }
        >
          {currentPlayer?.color}
        </span>
      </h3>

      {/* Доска */}
      <div
        className="
          grid grid-cols-8 
          border-4 border-gray-700 
          rounded-xl shadow-xl
        "
        style={{ width: "512px", height: "512px" }} // 64px * 8
      >
        {board.cells.map((row, index) => (
          <React.Fragment key={index}>
            {row.map((cell) => (
              <CellComponent
                key={cell.id}
                click={click}
                cell={cell}
                selected={
                  cell.x === selectedCell?.x && cell.y === selectedCell?.y
                }
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
