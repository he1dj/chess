import { Color, FENChar } from "./models";
import { Bishop } from "./pieces/bishop";
import { King } from "./pieces/king";
import { Knight } from "./pieces/knight";
import { Pawn } from "./pieces/pawn";
import { Piece } from "./pieces/piece";
import { Queen } from "./pieces/queen";
import { Rook } from "./pieces/rook";

export class Chessboard {
    private chessboard: (Piece | null)[][];
    private _playerColor!: Color.White;

    constructor() {
        this.chessboard = [
            [
                new Rook(Color.White), 
                new Knight(Color.White), 
                new Bishop(Color.White), 
                new Queen(Color.White), 
                new King(Color.White), 
                new Bishop(Color.White), 
                new Knight(Color.White), 
                new Rook(Color.White)
            ],
            [
                new Pawn(Color.White),
                new Pawn(Color.White),
                new Pawn(Color.White),
                new Pawn(Color.White),
                new Pawn(Color.White),
                new Pawn(Color.White),
                new Pawn(Color.White),
                new Pawn(Color.White)
            ],
            Array(8).fill(null),
            Array(8).fill(null),
            Array(8).fill(null),
            Array(8).fill(null),
            [
                new Pawn(Color.Black),
                new Pawn(Color.Black),
                new Pawn(Color.Black),
                new Pawn(Color.Black),
                new Pawn(Color.Black),
                new Pawn(Color.Black),
                new Pawn(Color.Black),
                new Pawn(Color.Black)
            ],
            [
                new Rook(Color.Black), 
                new Knight(Color.Black), 
                new Bishop(Color.Black), 
                new Queen(Color.Black), 
                new King(Color.Black), 
                new Bishop(Color.Black), 
                new Knight(Color.Black), 
                new Rook(Color.Black)
            ]
        ]
    }

    public get playerColor(): Color.White {
        return this._playerColor;
    }

    public get chessboardView(): (FENChar | null) [][] {
        return this.chessboard.map(row => {
            return row.map(piece => piece instanceof Piece ? piece.FENChar : null);
        })
    }

    public static isSquareDark(x: number, y: number): boolean {
        return x % 2 === 0 && y % 2 === 0 || x % 2 === 1 && y % 2 === 1;
    }
}