import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {Router, RouterLink} from '@angular/router';
import {AuthorizationService} from '../../../../shared/services/authorization.service';
import {FormsModule} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-sign-up-component',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
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


  constructor(private authService: AuthorizationService, private snackBar: MatSnackBar, private router: Router, private translate: TranslateService) {};

  onSignUp(): void {

    if (!this.email || !this.name || !this.password || !this.repeatPassword) {
      this.snackBar.open(
        this.translate.instant('signup.allFieldsRequired'),
        this.translate.instant('buttons.close'),
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        }
      );
      return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.snackBar.open(
        this.translate.instant('signup.invalidEmail'),
        this.translate.instant('buttons.close'),
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        }
      );
      return;
    }


    if (this.password !== this.repeatPassword) {
      this.snackBar.open(
        this.translate.instant('signup.passwordMismatch'),
        this.translate.instant('buttons.close'),
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        }
      );
      return;
    }


    this.authService.getUserByEmail(this.email).subscribe(existingUsers => {
      if (existingUsers.length > 0) {
        this.snackBar.open(
          this.translate.instant('signup.emailExists'),
          this.translate.instant('buttons.close'),
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
          }
        );
      } else {
        const newUser = {
          email: this.email,
          password: this.password,
          name: this.name,
          profilePicture: '',
          settings: {}
        };

        this.authService.registerUser(newUser).subscribe(() => {
          this.snackBar.open(
            this.translate.instant('signup.registrationSuccess'),
            this.translate.instant('buttons.close'),
            {
              duration: 20000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-success']
            }
          );

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        });
      }
    });
  }
}






