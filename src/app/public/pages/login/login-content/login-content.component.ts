import { Component } from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';


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
  ],
  templateUrl: './login-content.component.html',
  styleUrl: './login-content.component.css'
})
export class LoginComponent {

}
