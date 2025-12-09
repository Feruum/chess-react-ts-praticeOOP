import { Colors } from "../colors";
import { Cell } from "../cell";

export enum FigureNames {
  FIGURE = "figure",
  KING = "king",
  QUEEN = "queen",
  BISHOP = "bishop",
  KNIGHT = "knight",
  ROOK = "rook",
  PAWN = "pawn",
}

export class Figure {
  color: Colors;
  logo: typeof logo | null;
  cell: Cell;
  name: FigureNames;
  id: number;

  constructor(color: Colors, cell: Cell) {
    this.color = color;
    this.cell = cell;
    this.cell.figure = this;
    this.logo = null;
    this.name = FigureNames.FIGURE;
    this.id = Math.random();
  }

  canMove(target: Cell): boolean {
    if(target.figure?.color ===this.color)
      return false;
    if(target.figure?.name=== FigureNames.KING)
      return false;
    else return true;
  }

  moveFigure(target: Cell) {}
}
