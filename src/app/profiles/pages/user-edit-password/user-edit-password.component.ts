import { Component } from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatLabel} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-user-edit-password',
  imports: [
    MatIcon,
    MatIconButton,
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatButton
  ],
  templateUrl: './user-edit-password.component.html',
  styleUrl: './user-edit-password.component.css'
})
export class UserEditPasswordComponent {

}
