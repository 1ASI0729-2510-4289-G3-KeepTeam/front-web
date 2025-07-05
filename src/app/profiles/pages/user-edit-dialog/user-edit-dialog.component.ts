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

  goBack() {
    this.router.navigate(['/user-profile']);
  }

  getInitial(name: string): string {
    return name?.charAt(0).toUpperCase();
  }

  uploadPhoto() {
    this.fileInput.nativeElement.click();
  }

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
