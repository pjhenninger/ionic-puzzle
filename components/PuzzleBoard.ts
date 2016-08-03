import * as p from './PuzzlePiece'; 

export class PuzzleBoard{
    public PuzzlePieces : p.PuzzlePiece[][];

    constructor(){
        this.PuzzlePieces = [];
         for(var i: number = 0; i < 8; i++) {       
             this.PuzzlePieces[i] = [];     
            for(var j: number = 0; j< 8; j++) {
                this.PuzzlePieces[i][j] = new p.PuzzlePiece(p.getRandomColor());
            }
        }
    }
}