import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chessboard } from 'src/app/chess-logic/chessboard';
import { Color, FENChar, pieceImagePaths } from 'src/app/chess-logic/models';

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
  public get playerColor(): Color {
    return this.chessboard.playerColor;
  }
  public isSquareDark(x: number, y: number): boolean {
    return Chessboard.isSquareDark(x, y);
  }
}
