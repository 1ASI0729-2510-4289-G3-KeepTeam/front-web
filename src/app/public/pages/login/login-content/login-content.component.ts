import { Component } from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {AuthorizationService} from '../../../../shared/services/authorization.service';
import {FormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';



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
  ],
  templateUrl: './login-content.component.html',
  styleUrl: './login-content.component.css'
})

export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthorizationService, private snackBar: MatSnackBar,private router: Router) {}

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe(users => {
      if (users.length > 0) {
        console.log('Usuario autenticado:', users[0]);
        this.router.navigate(['/user-profile']); // Cambia a tu ruta deseada
      } else {

        this.snackBar.open('Email or password incorrect', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error-login']
        });
      }
    });
  }


}
