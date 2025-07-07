import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MatDialogRef
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
/**
 * Confirmation dialog component.
 * Used to prompt the user to confirm or cancel an action.
 */
@Component({
  selector: 'app-pop-confirm-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslateModule
  ],
  templateUrl: './pop-confirm-dialog.component.html',
  styleUrl: './pop-confirm-dialog.component.css'
})
export class PopConfirmDialogComponent {
  /**
   * Creates an instance of the confirmation dialog.
   *
   * @param dialogRef Reference to the opened dialog.
   * @param item The data passed to the dialog, typically the item being acted upon.
   */
  constructor(
    public dialogRef: MatDialogRef<PopConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any
  ) {}
  /**
   * Confirms the action and closes the dialog with a positive result.
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * Cancels the action and closes the dialog with a negative result.
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
