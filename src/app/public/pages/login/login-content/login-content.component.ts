import { Component } from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {AuthorizationService} from '../../../../shared/services/authorization.service';
import {FormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';



@Component({
  selector: 'app-login-component',
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

  constructor(private authService: AuthorizationService, private snackBar: MatSnackBar,private router: Router,private translate: TranslateService) {}

  onLogin(): void {

    if (!this.email || !this.password) {
      this.snackBar.open(
        this.translate.instant('login.fillAllFields'),
        this.translate.instant('buttons.close'),
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error-login']
        }
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.snackBar.open(
        this.translate.instant('login.invalidEmail'),
        this.translate.instant('buttons.close'),
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error-login']
        }
      );
      return;
    }

    this.authService.login(this.email, this.password).subscribe(users => {
      if (users.length > 0) {
        const user = users[0];
        localStorage.setItem('userId', user.id.toString());
        this.router.navigate(['/user-profile']);
      } else {
        this.snackBar.open(
          this.translate.instant('login.incorrectCredentials'),
          this.translate.instant('buttons.close'),
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-error-login']
          }
        );
      }
    });
  }


}
