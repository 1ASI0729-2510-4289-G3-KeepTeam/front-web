import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthorizationService } from '../../../../shared/services/authorization.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {SubscriptionService} from '../../../../payment/services/subscription.service';

@Component({
  selector: 'app-sign-up-component',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    RouterLink,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './sign-up-content.component.html',
  styleUrl: './sign-up-content.component.css'
})
export class SignUpComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  repeatPassword: string = '';

  constructor(
    private authService: AuthorizationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService,
    private subscriptionService: SubscriptionService
  ) {}

  onSignUp(): void {
    if (!this.email || !this.name || !this.password || !this.repeatPassword) {
      this.showError('signup.allFieldsRequired');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showError('signup.invalidEmail');
      return;
    }

    if (this.password !== this.repeatPassword) {
      this.showError('signup.passwordMismatch');
      return;
    }

    const newUser = {// si tu backend usa "username"
      email: this.email,
      password: this.password,
      name: this.name,
      profilePicture: 'https://example.com/default-profile.png',
      roles: ['user'] // puedes personalizar según tu lógica
    };

    this.authService.registerUser(newUser).subscribe({
      next: (createdUser) => {
        const userId = createdUser.id;

        const freeSubscription = {
          userId: userId,
          membershipId: 1, // 👈 Asegúrate de que 1 sea el ID del plan Free
          paymentCardId: null
        };

        this.subscriptionService.createSubscription(freeSubscription).subscribe({
          next: () => {
            this.snackBar.open(
              this.translate.instant('signup.registrationSuccess'),
              this.translate.instant('buttons.close'),
              {
                duration: 2000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-success']
              }
            );
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1500);
          },
          error: () => {
            this.snackBar.open(
              this.translate.instant('signup.freeSubscriptionError'),
              this.translate.instant('buttons.close'),
              {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-warning']
              }
            );
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }

  private showError(translationKey: string) {
    this.snackBar.open(
      this.translate.instant(translationKey),
      this.translate.instant('buttons.close'),
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error']
      }
    );
  }
}
