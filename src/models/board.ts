import { Cell } from "./cell";
import { Colors } from "./colors";
import { Pawn } from "./figures/pawn";
import { Bishop } from "./figures/bishop";
import { Knight } from "./figures/knight";
import { Rook } from "./figures/rook";
import { Queen } from "./figures/queen";
import { King } from "./figures/king";
import type { Figure } from "./figures/figure";

export class Board {
    cells: Cell[][] = [];
    lostBlackFigures: Figure[] = [];
    lostWhiteFigures: Figure[] = [];

    // состояние игры
    isCheck: boolean = false;
    isCheckmate: boolean = false;
    isGameOver: boolean = false;
    winner: Colors | null = null;

    // -----------------------------
    // КЛЕТКИ
    // -----------------------------
    public initCells() {
        this.cells = [];

        for (let y = 0; y < 8; y++) {
            const row: Cell[] = [];
            for (let x = 0; x < 8; x++) {
                const color = (x + y) % 2 === 0 ? Colors.WHITE : Colors.BLACK;
                row.push(new Cell(this, x, y, color, null));
            }
            this.cells.push(row);
        }
    }

    public getCell(x: number, y: number) {
        return this.cells[y][x];
    }

    // подсветка ходов
    public highlightCells(selectedCell: Cell | null) {
        for (let row of this.cells) {
            for (let target of row) {
                target.available = !!selectedCell?.figure?.canMove(target);
            }
        }
    }

    // копия доски
    public getCopyBoard(): Board {
        const newBoard = new Board();
        newBoard.cells = this.cells;
        newBoard.lostBlackFigures = this.lostBlackFigures;
        newBoard.lostWhiteFigures = this.lostWhiteFigures;
        return newBoard;
    }

    // -----------------------------
    // УСТАНОВКА ФИГУР
    // -----------------------------
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

    private addBishops() {
        new Bishop(Colors.BLACK, this.getCell(2, 0));
        new Bishop(Colors.BLACK, this.getCell(5, 0));
        new Bishop(Colors.WHITE, this.getCell(2, 7));
        new Bishop(Colors.WHITE, this.getCell(5, 7));
    }

    private addQueens() {
        new Queen(Colors.BLACK, this.getCell(3, 0));
        new Queen(Colors.WHITE, this.getCell(3, 7));
    }

    private addRooks() {
        new Rook(Colors.BLACK, this.getCell(0, 0));
        new Rook(Colors.BLACK, this.getCell(7, 0));
        new Rook(Colors.WHITE, this.getCell(0, 7));
        new Rook(Colors.WHITE, this.getCell(7, 7));
    }

    private addKnights() {
        new Knight(Colors.BLACK, this.getCell(1, 0));
        new Knight(Colors.BLACK, this.getCell(6, 0));
        new Knight(Colors.WHITE, this.getCell(1, 7));
        new Knight(Colors.WHITE, this.getCell(6, 7));
    }

    public addFigures() {
        this.addPawns();
        this.addRooks();
        this.addKnights();
        this.addBishops();
        this.addQueens();
        this.addKings();
    }

    // -----------------------------
    // ЛОГИКА ШАХ / МАТ
    // -----------------------------

    // Находим короля по цвету
    public getKing(color: Colors): King | null {
        for (let row of this.cells) {
            for (let cell of row) {
                if (cell.figure instanceof King && cell.figure.color === color) {
                    return cell.figure;
                }
            }
        }
        return null;
    }

    // Шах?
    public isKingUnderAttack(color: Colors): boolean {
        const king = this.getKing(color);
        if (!king) return false;

        for (let row of this.cells) {
            for (let cell of row) {
                const fig = cell.figure;

                if (fig && fig.color !== color) {
                    if (fig.canMove(king.cell)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Мат?
    public checkCheckmate(color: Colors): boolean {
        if (!this.isKingUnderAttack(color)) return false;

        // Проверяем все ходы всех фигур цвета
        for (let row of this.cells) {
            for (let cell of row) {
                const fig = cell.figure;

                if (fig && fig.color === color) {
                    for (let row2 of this.cells) {
                        for (let target of row2) {
                            if (fig.canMove(target)) {
                                const savedFigure = target.figure;
                                const oldCell = fig.cell;

                                // тестовый ход
                                fig.moveFigure(target);

                                const stillCheck = this.isKingUnderAttack(color);

                                // откат хода
                                target.figure = savedFigure;
                                oldCell.figure = fig;

                                if (!stillCheck) {
                                    return false; // есть спасение
                                }
                            }
                        }
                    }
                }
            }
        }

        return true; // спасения нет → мат
    }

    // Вызывать после каждого хода
    public checkGameState(currentColor: Colors) {
        const enemyColor = currentColor === Colors.WHITE ? Colors.BLACK : Colors.WHITE;

        if (this.isKingUnderAttack(enemyColor)) {
            this.isCheck = true;

            if (this.checkCheckmate(enemyColor)) {
                this.isCheckmate = true;
                this.isGameOver = true;
                this.winner = currentColor;
            }
        } else {
            this.isCheck = false;
        }
    }
}
