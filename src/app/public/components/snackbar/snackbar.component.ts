import {Component, Inject} from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef
} from '@angular/material/snack-bar';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-snackbar',
  imports: [
    MatSnackBarLabel,
    MatSnackBarActions,
    MatButton,
    MatSnackBarAction
  ],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public msg: string
  ) {}
}
