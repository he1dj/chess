import { Color, Coords, FENChar, SafeSquares } from "./models";
import { Bishop } from "./pieces/bishop";
import { King } from "./pieces/king";
import { Knight } from "./pieces/knight";
import { Pawn } from "./pieces/pawn";
import { Piece } from "./pieces/piece";
import { Queen } from "./pieces/queen";
import { Rook } from "./pieces/rook";

export class Chessboard {
    private chessboard: (Piece | null)[][];
    private readonly chessBoardSize: number = 8;
    private _playerColor!: Color.White;
    private _safeSquares!: SafeSquares;

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
        this._safeSquares = this.findSafeSquares();
    }

    public get playerColor(): Color.White {
        return this._playerColor;
    }

    public get chessboardView(): (FENChar | null) [][] {
        return this.chessboard.map(row => {
            return row.map(piece => piece instanceof Piece ? piece.FENChar : null);
        })
    }

    public get safeSquares(): SafeSquares {
        return this._safeSquares;
    }

    public static isSquareDark(x: number, y: number): boolean {
        return x % 2 === 0 && y % 2 === 0 || x % 2 === 1 && y % 2 === 1;
    }

    private areCoordsValid(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.chessBoardSize && y < this.chessBoardSize;
    }

    public isInCheck(playerColor: Color): boolean {
        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                const piece: Piece | null = this.chessboard[x][y];
                if (!piece || piece.color === playerColor) continue;
                for (const {x: dx, y: dy} of piece.directions) {
                    let newX: number = x + dx;
                    let newY: number = y + dy;
                    if (!this.areCoordsValid(newX, newY)) continue;
                    if (piece instanceof Pawn || piece instanceof Knight || piece instanceof King) {
                        if (piece instanceof Pawn && dy === 0) continue;
                        const attackedPiece: Piece | null = this.chessboard[newX][newY];
                        if (attackedPiece instanceof King && attackedPiece.color === playerColor) return true;
                    } else {
                        while(this.areCoordsValid(newX, newY)) {
                            const attackedPiece: Piece | null = this.chessboard[newX][newY];
                            if (attackedPiece instanceof King && attackedPiece.color === playerColor) return true;
                            if (attackedPiece !== null) break;
                            newX += dx;
                            newY += dy;
                        }
                    }
                }
            }
        }
        return false
    }

    private isPositionSafeAfterMove (piece: Piece, prevX: number, prevY: number, newX: number, newY: number): boolean {
        const newPiece: Piece | null = this.chessboard[newX][newY];
        if (newPiece && newPiece.color === piece.color) return false;
        this.chessboard[newX][newY] = piece;
        const isPositionSafe = !this.isInCheck(piece.color);
        this.chessboard[prevX][prevY] = piece;
        this.chessboard[newX][newY] = newPiece;

        return isPositionSafe;
    }

    private findSafeSquares(): SafeSquares {
        const safeSquares: SafeSquares = new Map<string, Coords[]>();
        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                const piece: Piece | null = this.chessboard[x][y];
                if (!piece || piece.color !== this._playerColor) continue;
                const pieceSafeSquares: Coords[] = [];
                for (const {x: dx, y: dy} of piece.directions) {
                    let newX: number = x + dx;
                    let newY: number = y + dy;
                    if (!this.areCoordsValid(newX, newY)) continue;
                    let newPiece: Piece | null = this.chessboard[newX][newY];
                    if (newPiece && newPiece.color === piece.color) continue;
                    if (piece instanceof Pawn) {
                        if (dx === 2 || dx == -2) {
                            if (newPiece) continue;
                            if (this.chessboard[newX + (dx === 2 ? -1: 1)][newY]) continue;
                        }
                        if ((dx === 1 || dx === -1) && dy === 0 && newPiece) continue;
                        if ((dy === 1 || dy === -1) && (!newPiece || piece.color === newPiece.color)) continue;
                    }
                    if (piece instanceof Pawn || piece instanceof Knight || piece instanceof King) {
                        if (this.isPositionSafeAfterMove(piece, x, y, newX, newY)) {
                            pieceSafeSquares.push({x: newX, y: newY});
                        }
                    } else  {
                        while (this.areCoordsValid(newX, newY)) {
                            newPiece =  this.chessboard[newX][newY];
                            if (newPiece && newPiece.color === piece.color) break;
                            if (this.isPositionSafeAfterMove(piece, x, y, newX, newY)) {
                                pieceSafeSquares.push({x: newX, y: newY});
                            }
                            if (newPiece !== null) break;
                            newX += dx;
                            newY += dy;
                        }
                    }
                }
                if (pieceSafeSquares.length) {
                    safeSquares.set(x + "," + y, pieceSafeSquares);
                }
            } 
        }

        return safeSquares;
    }
}