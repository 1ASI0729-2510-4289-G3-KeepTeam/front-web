import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import { User } from '../../model/user'
import {MatFormField} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {UploadService} from '../../../shared/services/images.service'
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';

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

  constructor(
    private userService: UserService,
    private router: Router,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId')); // o tu lógica de login
    if (userId) {
      this.userService.getUserById(userId).subscribe(data => this.user = data);
    }
  }

  goBack() {
    this.router.navigate(['/user-profile']);
  }

  getInitial(name: string): string {
    return name?.charAt(0).toUpperCase();
  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; // Importa ElementRef y ViewChild
  defaultImage = 'assets/default-avatar.png';

  uploadPhoto() {
    this.fileInput.nativeElement.click();
    alert('Upload photo feature not implemented yet.');
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
          // Aquí puedes guardar res.secure_url en tu modelo de usuario, por ejemplo
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
      next: (updatedUser) => {
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

