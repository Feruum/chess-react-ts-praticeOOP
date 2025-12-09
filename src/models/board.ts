import { Cell } from "./cell";
import { Colors } from "./colors";
import { Pawn } from "./figures/pawn";
import { Bishop } from "./figures/bishop";
import { Knight } from "./figures/knight";
import { Rook } from "./figures/rook";
import { Queen } from "./figures/queen";
import { King } from "./figures/king";
import type { Figure } from "./figures/figure";
import { FigureNames } from "./figures/figure";

export class Board {
  cells: Cell[][] = [];
  lostBlackFigures: Figure[] = [];
  lostWhiteFigures: Figure[] = [];
  isCheck: boolean = false;
  isGameOver: boolean = false;
  winner: Colors | null = null;

  // ---------------------------------------------------------
  // ИНИЦИАЛИЗАЦИЯ ДОСКИ
  // ---------------------------------------------------------
  public initCells() {
    this.cells = [];

    for (let y = 0; y < 8; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < 8; x++) {
        row.push(
          new Cell(
            this,
            x,
            y,
            (x + y) % 2 === 0 ? Colors.WHITE : Colors.BLACK,
            null
          )
        );
      }
      this.cells.push(row);
    }
  }

  public getCell(x: number, y: number) {
    return this.cells[y][x];
  }

  // ---------------------------------------------------------
  // ПОДСВЕТКА ХОДОВ
  // ---------------------------------------------------------
  public hightLightCells(selectedCell: Cell | null) {
    for (let row of this.cells) {
      for (let target of row) {
        target.available = !!selectedCell?.figure?.canMove(target);
      }
    }
  }

  // ---------------------------------------------------------
  // КОПИРОВАНИЕ ДОСКИ
  // ---------------------------------------------------------
  public getCopyBoard(): Board {
    const newBoard = new Board();
    newBoard.cells = this.cells.map((row) =>
      row.map(
        (cell) =>
          new Cell(
            newBoard,
            cell.x,
            cell.y,
            cell.color,
            cell.figure // <-- создаём ссылку, но этого достаточно для симуляции
          )
      )
    );

    newBoard.lostWhiteFigures = [...this.lostWhiteFigures];
    newBoard.lostBlackFigures = [...this.lostBlackFigures];

    return newBoard;
  }

  // ---------------------------------------------------------
  // НАХОДИМ КОРОЛЯ
  // ---------------------------------------------------------
  private findKing(color: Colors): Cell | null {
    for (let row of this.cells) {
      for (let cell of row) {
        if (
          cell.figure?.name === FigureNames.KING &&
          cell.figure.color === color
        ) {
          return cell;
        }
      }
    }
    return null;
  }

  // ---------------------------------------------------------
  // ШАХ
  // ---------------------------------------------------------
  public isKingUnderAttack(color: Colors): boolean {
    const kingCell = this.findKing(color);
    if (!kingCell) return false;

    for (let row of this.cells) {
      for (let cell of row) {
        if (cell.figure && cell.figure.color !== color) {
          if (cell.figure.canMove(kingCell)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // ---------------------------------------------------------
  // МАТ
  // ---------------------------------------------------------
  public isCheckmate(color: Colors): boolean {
    if (!this.isKingUnderAttack(color)) return false;

    // Проверяем все фигуры цвета
    for (let row of this.cells) {
      for (let cell of row) {
        if (!cell.figure || cell.figure.color !== color) continue;

        // Пробуем каждый ход
        for (let targetRow of this.cells) {
          for (let target of targetRow) {
            if (!cell.figure?.canMove(target)) continue;

            // Сохраняем состояние
           const savedFrom: Figure | null = cell.figure;
const savedTo: Figure | null = target.figure;

            

            // Ход
            target.figure = savedFrom;
            cell.figure = null;

            const stillCheck = this.isKingUnderAttack(color);

            // Откат
            cell.figure = savedFrom;
            target.figure = savedTo;

            if (!stillCheck) return false; // есть спасение
          }
        }
      }
    }

    return true; // нет ходов → мат
  }

  // ---------------------------------------------------------
  // ПАТ
  // ---------------------------------------------------------
  public isStalemate(color: Colors): boolean {
    if (this.isKingUnderAttack(color)) return false;

    // Ищем хотя бы один ход
    for (let row of this.cells) {
      for (let cell of row) {
        if (!cell.figure || cell.figure.color !== color) continue;

        for (let targetRow of this.cells) {
          for (let target of targetRow) {
            if (!cell.figure?.canMove(target)) continue;

            // Симулируем
            const savedFrom: Figure | null = cell.figure;
            const savedTo: Figure | null = target.figure;


            target.figure = savedFrom;
            cell.figure = null;

            const inCheck = this.isKingUnderAttack(color);

            // Откат
            cell.figure = savedFrom;
            target.figure = savedTo;

            if (!inCheck) return false; // есть ход, не пат
          }
        }
      }
    }

    return true;
  }

  // ---------------------------------------------------------
  // ДОБАВЛЕНИЕ ФИГУР
  // ---------------------------------------------------------
  private addPawns() {
    for (let i = 0; i < 8; i++) {
      new Pawn(Colors.BLACK, this.getCell(i, 1));
      new Pawn(Colors.WHITE, this.getCell(i, 6));
    }
  }

  private addKings() {
    new King(Colors.BLACK, this.getCell(4, 0));
    new King(Colors.WHITE, this.getCell(4, 7));
  }

  private addQueens() {
    new Queen(Colors.BLACK, this.getCell(3, 0));
    new Queen(Colors.WHITE, this.getCell(3, 7));
  }

  private addBishops() {
    new Bishop(Colors.BLACK, this.getCell(2, 0));
    new Bishop(Colors.BLACK, this.getCell(5, 0));
    new Bishop(Colors.WHITE, this.getCell(2, 7));
    new Bishop(Colors.WHITE, this.getCell(5, 7));
  }

  private addKnights() {
    new Knight(Colors.BLACK, this.getCell(1, 0));
    new Knight(Colors.BLACK, this.getCell(6, 0));
    new Knight(Colors.WHITE, this.getCell(1, 7));
    new Knight(Colors.WHITE, this.getCell(6, 7));
  }

  private addRooks() {
    new Rook(Colors.BLACK, this.getCell(0, 0));
    new Rook(Colors.BLACK, this.getCell(7, 0));
    new Rook(Colors.WHITE, this.getCell(0, 7));
    new Rook(Colors.WHITE, this.getCell(7, 7));
  }

  public addFigures() {
    this.addPawns();
    this.addRooks();
    this.addKnights();
    this.addBishops();
    this.addQueens();
    this.addKings();
  }
}
