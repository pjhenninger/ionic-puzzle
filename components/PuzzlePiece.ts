export enum PieceColor{
    Red,
    Green,
    Blue,
    Yellow,
    Purple,
    White,
    Black    
}

export class PuzzlePiece{
    public Color : PieceColor;

    constructor(color:PieceColor){
        this.Color = color;
    }     
}

export function getRandomColor() : PieceColor {
        var keys = Object.keys(PieceColor),
            index = Math.floor(Math.random() * (keys.length/2)),
            k = keys[index];
        if (typeof PieceColor[k] === 'number')
            return PieceColor[k];
        return (<any>PieceColor)[parseInt(k, 10)];
    }