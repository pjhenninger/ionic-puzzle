"use strict";
var p = require('./PuzzlePiece');
var PuzzleBoard = (function () {
    function PuzzleBoard() {
        this.PuzzlePieces = [];
        for (var i = 0; i < 8; i++) {
            this.PuzzlePieces[i] = [];
            for (var j = 0; j < 8; j++) {
                this.PuzzlePieces[i][j] = new p.PuzzlePiece(p.getRandomColor());
            }
        }
    }
    return PuzzleBoard;
}());
exports.PuzzleBoard = PuzzleBoard;
//# sourceMappingURL=PuzzleBoard.js.map