"use strict";
const p = require('./PuzzlePiece');
class PuzzleBoard {
    constructor() {
        this.PuzzlePieces = [];
        for (var i = 0; i < 8; i++) {
            this.PuzzlePieces[i] = [];
            for (var j = 0; j < 8; j++) {
                this.PuzzlePieces[i][j] = new p.PuzzlePiece(p.getRandomColor());
            }
        }
    }
    toJSON() {
        return JSON.stringify(this.PuzzlePieces);
    }
}
exports.PuzzleBoard = PuzzleBoard;
//# sourceMappingURL=PuzzleBoard.js.map