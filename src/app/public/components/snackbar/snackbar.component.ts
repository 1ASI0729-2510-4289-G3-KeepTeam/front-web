import {Component, Inject} from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef
} from '@angular/material/snack-bar';
import {MatButton} from '@angular/material/button';
/**
 * Custom snackbar component.
 * Displays a message using Angular Material's snack bar system.
 */
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
  /**
   * Creates an instance of the snackbar component.
   *
   * @param snackBarRef Reference to the opened snack bar instance.
   * @param msg The message to be displayed in the snackbar.
   */
  constructor(
    public snackBarRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public msg: string
  ) {}
}
