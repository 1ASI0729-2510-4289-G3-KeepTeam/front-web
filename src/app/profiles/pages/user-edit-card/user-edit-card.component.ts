import { Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatLabel} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserService } from '../../services/user.service';
import {User} from '../../model/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-edit-card',
    imports: [
        MatButton,
        MatFormField,
        MatIcon,
        MatIconButton,
        MatInput,
        MatLabel,
        ReactiveFormsModule
    ],
  templateUrl: './user-edit-card.component.html',
  styleUrl: './user-edit-card.component.css'
})
export class UserEditCardComponent implements OnInit {
  paymentForm!: FormGroup;
  user: User = new User();
  constructor(private fb: FormBuilder, private location: Location, private userService: UserService, private router: Router) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', Validators.required],
      holder: ['', Validators.required],
      expirationDate: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]]
    });
  }


  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (userId) {
      this.userService.getUserById(userId).subscribe(user => {
        this.user = user;

        // Rellenar el formulario con los datos existentes si hay
        this.paymentForm = this.fb.group({
          cardNumber: [user.card?.cardNumber || ''],
          holder: [user.card?.holder || ''],
          expirationDate: [user.card?.expirationDate || ''],
          cvv: [user.card?.cvv || '']
        });
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
  changeCard(): void {
    if (this.paymentForm.valid) {
      const cardData = this.paymentForm.value;

      this.userService.updateUserCard(this.user.id, cardData).subscribe({
        next: () => alert('Card updated successfully!'),
        error: () => alert('Failed to update card.')
      });
    } else {
      this.paymentForm.markAllAsTouched();
    }
  }

  goBack(): void {
    this.location.back();
  }

}
