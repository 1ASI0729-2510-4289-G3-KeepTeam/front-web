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
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

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

  constructor(
    private userService: UserService,
    private router: Router,
    private uploadService: UploadService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
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

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  defaultImage = 'assets/default-avatar.png';

  uploadPhoto() {
    this.fileInput.nativeElement.click();
    this.translate.get('profileEdit.uploadPhotoNotImplemented').subscribe((res: string) => {
      alert(res);
    });
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
    this.userService.updateUser(this.user).subscribe(() => {
      this.translate.get('profileEdit.profileUpdatedSuccess').subscribe((res: string) => {
        alert(res);
      });
      this.router.navigate(['/user-profile']);
    });
  }
}

