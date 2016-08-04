"use strict";
const p = require('./PuzzlePiece');
class PuzzleBoard {
    constructor() {
        this.rowCount = 8;
        this.columnCount = 8;
        this.PuzzlePieces = [];
        for (var i = 0; i < this.rowCount; i++) {
            this.PuzzlePieces[i] = [];
            for (var j = 0; j < this.columnCount; j++) {
                this.PuzzlePieces[i][j] = new p.PuzzlePiece(this.getRandomValidColor(i, j));
            }
        }
    }
    toJSON() {
        return JSON.stringify(this.PuzzlePieces);
    }
    getRandomValidColor(rowIndex, columnIndex) {
        var color = p.getRandomColor();
        if (rowIndex >= 2 && columnIndex < 2) {
            while (color === this.PuzzlePieces[rowIndex - 1][columnIndex].Color && color === this.PuzzlePieces[rowIndex - 2][columnIndex].Color) {
                color = p.getRandomColor();
            }
        }
        else if (columnIndex >= 2 && rowIndex < 2) {
            while (color === this.PuzzlePieces[rowIndex][columnIndex - 1].Color && color === this.PuzzlePieces[rowIndex][columnIndex - 2].Color) {
                color = p.getRandomColor();
            }
        }
        else if (rowIndex >= 2 && columnIndex >= 2) {
            while ((color === this.PuzzlePieces[rowIndex - 1][columnIndex].Color && color === this.PuzzlePieces[rowIndex - 2][columnIndex].Color) ||
                (color === this.PuzzlePieces[rowIndex][columnIndex - 1].Color && color === this.PuzzlePieces[rowIndex][columnIndex - 2].Color)) {
                color = p.getRandomColor();
            }
        }
        return color;
    }
}
exports.PuzzleBoard = PuzzleBoard;
//# sourceMappingURL=PuzzleBoard.js.map