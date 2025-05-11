import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {Router, RouterLink} from '@angular/router';
import {AuthorizationService} from '../../../../shared/services/authorization.service';
import {FormsModule} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


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
    FormsModule
  ],
  templateUrl: './sign-up-content.component.html',
  styleUrl: './sign-up-content.component.css'
})
export class SignUpComponent {
  name: string = '';
  email: string = '';
  password: string = '';


  constructor(private authService: AuthorizationService, private snackBar: MatSnackBar, private router: Router) {};

  onSignUp(): void {
    this.authService.getUserByEmail(this.email).subscribe(existingUsers => {
      if (existingUsers.length > 0) {
        this.snackBar.open('Ya existe una cuenta con ese correo.', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      } else {
        const newUser = {
          email: this.email,
          password: this.password,
          name: this.name,
          profilePicture: '',
          settings: {}
        };

        this.authService.registerUser(newUser).subscribe(() => {
          this.snackBar.open('Registro exitoso. Ahora puedes iniciar sesión.', 'Cerrar', {
            duration: 20000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-success']
          });

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        });
      }
    });
  }
}






