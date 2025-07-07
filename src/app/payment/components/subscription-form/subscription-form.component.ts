import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentCard } from '../../model/payment-card';
import { Membership } from '../../model/membership';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import {TokenStorageService} from '../../../shared/services/tokenStorage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.css']
})
export class SubscriptionFormComponent implements OnInit {
  @Input() userId!: number;
  @Input() cards: PaymentCard[] = [];
  @Input() memberships: Membership[] = [];
  @Output() submitForm = new EventEmitter<{ membershipId: number; paymentCardId: number }>();
  @Input() selectedMembershipId?: number;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tokenStorageService: TokenStorageService,
    private router: Router
    ) {}



  ngOnInit(): void {
    const userId = this.tokenStorageService.getUserId();
    this.userId = Number(userId);
    this.form = this.fb.group({
      membershipId: [null, Validators.required],
      paymentCardId: [null, Validators.required]
    });
    if (this.selectedMembershipId) {
      this.form.patchValue({ membershipId: this.selectedMembershipId });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const formValue = this.form.value;
    this.submitForm.emit({
      membershipId: formValue.membershipId,
      paymentCardId: formValue.paymentCardId// si lo necesitas pasar como parte del comando
    });
  }

  selectCard(cardId: number) {
    this.form.get('paymentCardId')?.setValue(cardId);
  }

  get selectedCardId(): number | null {
    return this.form.get('paymentCardId')?.value ?? null;
  }

  goToAddCard() {
    this.router.navigate(['/edit-card']); // O la ruta que tengas para registrar tarjetas
  }

  goBack() {
    this.router.navigate(['/user-profile']);
  }
}
