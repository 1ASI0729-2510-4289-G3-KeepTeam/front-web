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

  constructor(
    public dialogRef: MatDialogRef<PopConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
