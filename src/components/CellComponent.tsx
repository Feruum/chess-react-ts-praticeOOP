import { Cell } from "../models/cell";
import "../App.css";
interface CellProps {
  cell: Cell;
  selected: boolean;
  click: (cell: Cell) => void;
}

export default function CellComponent({ cell, selected, click }: CellProps) {
  return (
    <div
      className={`w-[64px] h-[64px] flex justify-center items-center 
        
        ${cell.color === "black" ? "bg-[#444]" : "bg-[#eee]"}`}
      style={{ background: cell.available && cell.figure ? "green" : "" }}
      onClick={() => click(cell)}
    >
      {cell.available && !cell.figure && (
        <div className="absolute w-4 h-4 bg-amber-400/70 rounded-full "></div>
      )}
      {cell.figure?.logo && (
        <img
          className="w-[48px] h-[48px] object-contain select-none"
          src={cell.figure.logo}
          alt=""
        />
      )}
    </div>
  );
}
