import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatLabel } from '@angular/material/input';
import { MatError } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToolbarComponent } from '../../../public/components/toolbar/toolbar.component';
import { TokenStorageService } from '../../../shared/services/tokenStorage.service'; // ✅ importado
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-user-edit-password',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    NgIf,
    MatIcon,
    MatIconButton,
    MatError,
    ToolbarComponent,
    TranslatePipe
  ],
  templateUrl: './user-edit-password.component.html',
  styleUrl: './user-edit-password.component.css'
})
export class UserEditPasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  user: User = new User();

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private userService: UserService,
    private router: Router,
    private tokenStorageService: TokenStorageService // ✅ inyectado
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario inmediatamente para evitar errores de binding
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    const userId = this.tokenStorageService.getUserId(); // ✅ uso correcto del servicio

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: user => this.user = user,
      error: err => console.error('Error al obtener el usuario:', err)
    });
  }

  get currentPassword() {
    return this.passwordForm.get('currentPassword');
  }

  get newPassword() {
    return this.passwordForm.get('newPassword');
  }

  get repeatPassword() {
    return this.passwordForm.get('repeatPassword');
  }

  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;
    return newPassword === repeatPassword ? null : { passwordMismatch: true };
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.userService.changePassword(this.user.id, currentPassword, newPassword).subscribe({
        next: () => alert('Password changed successfully!'),
        error: () => alert('Failed to change password.')
      });
      this.passwordForm.reset();
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

  goBack(): void {
    this.location.back();
  }
}
