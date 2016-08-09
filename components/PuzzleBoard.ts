import * as p from './PuzzlePiece';

export class PuzzleBoard {
    public PuzzlePieces: p.PuzzlePiece[][];
    private rowCount = 8;
    private columnCount = 8;

    constructor() {
        this.PuzzlePieces = [];
        for (var i: number = 0; i < this.rowCount; i++) {
            this.PuzzlePieces[i] = [];
            for (var j: number = 0; j < this.columnCount; j++) {
                this.PuzzlePieces[i][j] = new p.PuzzlePiece(this.getRandomValidColor(i, j));
            }
        }
    }

    public toJSON(): string {
        return JSON.stringify(this.PuzzlePieces);
    }

    private getRandomValidColor(rowIndex, columnIndex): p.PieceColor {
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

    public getRandomPieces(count:number): string{
    var puzzlePieces = [];
    for(var i = 0; i < count; i++){
        puzzlePieces.push(new p.PuzzlePiece(p.getRandomColor()));
    }

    return JSON.stringify(puzzlePieces);
}
}