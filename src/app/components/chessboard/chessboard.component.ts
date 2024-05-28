import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chessboard } from 'src/app/chess-logic/chessboard';
import { Color, Coords, FENChar, SafeSquares, pieceImagePaths } from 'src/app/chess-logic/models';
import { SelectedSquare } from './models';

@Component({
  selector: 'app-chessboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chessboard.component.html',
  styleUrl: './chessboard.component.scss',
})
export class ChessboardComponent {
  public pieceImagePaths = pieceImagePaths;
  private chessboard = new Chessboard();
  public chessboardView: (FENChar | null)[][] = this.chessboard.chessboardView;
  private selectedSquare: SelectedSquare = { piece: null };
  private pieceSafeSquares: Coords[] = [];

  public selectingPiece(x: number, y: number): void {
    const piece: FENChar | null = this.chessboardView[x][y];
    if (piece === null) return;
    this.selectedSquare = { piece, x, y };
    this.pieceSafeSquares = this.safeSquares.get(x + "," + y) || [];
  }

  public get playerColor(): Color {
    return this.chessboard.playerColor;
  }

  public get safeSquares(): SafeSquares { 
    return this.chessboard.safeSquares;
  }

  public isSquareSelected(x: number, y: number): boolean {
    if (!this.selectedSquare.piece) return false;
    return this.selectedSquare.x === x && this.selectedSquare.y === y;
  }

  public isSquareSafeForSelectedPiece(x: number, y: number): boolean {
    return this.pieceSafeSquares.some(coords => coords.x === x && coords.y === y);
  }

  public isSquareDark(x: number, y: number): boolean {
    return Chessboard.isSquareDark(x, y);
  }
}
