import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { UploadService } from '../../../shared/services/images.service';
import { ToolbarComponent } from '../../../public/components/toolbar/toolbar.component';
import { TokenStorageService } from '../../../shared/services/tokenStorage.service';
import {TranslatePipe} from '@ngx-translate/core';
/**
 * Component that allows the user to edit their profile details including name and profile picture.
 * Loads the user from tokenStorage, and allows uploading a profile image via UploadService.
 */
@Component({
  selector: 'app-user-edit-dialog',
  imports: [
    MatFormField,
    FormsModule,
    MatInput,
    MatButton,
    MatLabel,
    MatIcon,
    MatIconButton,
    ToolbarComponent,
    TranslatePipe,
  ],
  templateUrl: './user-edit-dialog.component.html',
  styleUrl: './user-edit-dialog.component.css'
})
export class UserEditDialogComponent {
  user: User = {} as User;
  defaultImage = 'assets/default-avatar.png';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private router: Router,
    private uploadService: UploadService,
    private tokenStorageService: TokenStorageService // ✅ Inyección del servicio
  ) {}
  /**
   * Loads the user data on component initialization using the stored user ID.
   * Redirects to login if no user ID is found.
   */
  ngOnInit(): void {
    const userId = this.tokenStorageService.getUserId(); // ✅ Usamos el servicio
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (data) => this.user = data,
        error: (err) => console.error('Error al obtener usuario:', err)
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
  /**
   * Navigates back to the user profile page.
   */
  goBack() {
    this.router.navigate(['/user-profile']);
  }
  /**
   * Returns the capitalized first letter of the user's name.
   * Used for displaying initials when no profile picture is available.
   *
   * @param name The user's name
   */
  getInitial(name: string): string {
    return name?.charAt(0).toUpperCase();
  }
  /**
   * Triggers the file input element to open the file picker dialog.
   */
  uploadPhoto() {
    this.fileInput.nativeElement.click();
  }
  /**
   * Handles the file input change event to upload a new profile picture.
   * The uploaded image is sent to the UploadService (e.g., Cloudinary).
   *
   * @param event The change event from the file input
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Archivo seleccionado:', file);

      this.uploadService.uploadImage(file).subscribe({
        next: res => {
          console.log('Imagen subida correctamente:', res);
          this.user.profilePicture = res.secure_url;
        },
        error: err => {
          console.error('Error al subir imagen a Cloudinary:', err);
        }
      });
    } else {
      console.warn('No se seleccionó ningún archivo');
    }
  }
  /**
   * Saves the updated user profile data.
   * Shows an alert on success or failure.
   */
  saveChanges(): void {
    this.userService.updateUser(this.user).subscribe({
      next: () => {
        alert('Profile updated!');
        this.router.navigate(['/user-profile']);
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        alert('Error updating profile');
      }
    });
  }
}
