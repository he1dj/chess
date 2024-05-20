import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChessboardComponent } from './components/chessboard/chessboard.component';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    ChessboardComponent
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Chess';
}
