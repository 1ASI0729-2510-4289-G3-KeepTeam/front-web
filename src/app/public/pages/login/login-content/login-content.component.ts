import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthorizationService } from '../../../../shared/services/authorization.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatFormField,
    MatButton,
    RouterLink,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './login-content.component.html',
  styleUrl: './login-content.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthorizationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService
  ) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.showError('login.fillAllFields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showError('login.invalidEmail');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // ✅ Aquí se asume que el backend devuelve un token JWT
        if (response.token) {
          localStorage.setItem('access_token', response.token);
          this.router.navigate(['/user-profile']);
        } else {
          this.showError('login.incorrectCredentials');
        }
      },
      error: () => {
        this.showError('login.incorrectCredentials');
      }
    });
  }

  private showError(key: string): void {
    this.snackBar.open(
      this.translate.instant(key),
      this.translate.instant('buttons.close'),
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error-login']
      }
    );
  }
}
