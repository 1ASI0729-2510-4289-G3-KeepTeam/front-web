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
  /**
   * Reactive form for password change.
   * Includes fields: currentPassword, newPassword, and repeatPassword.
   */
  passwordForm!: FormGroup;

  /**
   * Currently authenticated user, retrieved using the userId from the token.
   */
  user: User = new User();
  successMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private userService: UserService,
    private router: Router,
    private tokenStorageService: TokenStorageService // ✅ inyectado
  ) {}
  /**
   * Initializes the component and the reactive form.
   * Checks the user's token and loads the user's data.
   */
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

  /**
   * Gets the form control for the current password.
   */
  get currentPassword() {
    return this.passwordForm.get('currentPassword');
  }

  /**
   * Gets the form control for the current password.
   */
  get newPassword() {
    return this.passwordForm.get('newPassword');
  }
  /**
   * Gets the form control for the repeated new password.
   */
  get repeatPassword() {
    return this.passwordForm.get('repeatPassword');
  }
  /**
   * Custom validator to check that newPassword and repeatPassword fields match.
   *
   * @param group The form group containing the password fields.
   */
  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;
    return newPassword === repeatPassword ? null : { passwordMismatch: true };
  }
  /**
   * Handles the password change process.
   * Submits the form if valid, sends data to the backend, and handles the response.
   */
  changePassword(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.userService.changePassword(this.user.id, currentPassword, newPassword).subscribe({
        next: () => {
          this.successMessage = '¡Contraseña cambiada con éxito!';

          // Redirigir después de un pequeño delay
          setTimeout(() => {
            this.router.navigate(['/user-profile']);
          }, 2000); // Espera 2 segundos antes de redirigir
        },
        error: () => {
          alert('No se pudo cambiar la contraseña');
        }
      });
      this.passwordForm.reset();
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
  /**
   * Navigates back to the previous page using the browser's history.
   */
  goBack(): void {
    this.location.back();
  }
}
