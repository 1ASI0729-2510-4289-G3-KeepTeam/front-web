import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthorizationService } from '../../../../shared/services/authorization.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TokenStorageService } from '../../../../shared/services/tokenStorage.service';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
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
    private translate: TranslateService,
    private tokenStorageService: TokenStorageService
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
        const token = response.token;
        const user = response;
        this.tokenStorageService.saveToken(token);
        this.tokenStorageService.saveUser(user);

        console.log('✅ Login exitoso. ID guardado:', user.id);
        this.router.navigate(['/user-profile']);
      },
      error: () => {
        this.showError('login.failed');
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
