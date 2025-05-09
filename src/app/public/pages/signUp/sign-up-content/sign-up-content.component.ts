import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {RouterLink} from '@angular/router';

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
    RouterLink
  ],
  templateUrl: './sign-up-content.component.html',
  styleUrl: './sign-up-content.component.css'
})
export class SignUpComponent {

}
