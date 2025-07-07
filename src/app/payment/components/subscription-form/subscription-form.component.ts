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

/**
 * SubscriptionFormComponent
 *
 * Component responsible for rendering and handling the subscription form,
 * allowing the user to select a membership and a payment card.
 */
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
  /**
   * The ID of the authenticated user.
   */
  @Input() userId!: number;
  /**
   * List of available payment cards for the user.
   */
  @Input() cards: PaymentCard[] = [];
  /**
   * List of available memberships.
   */
  @Input() memberships: Membership[] = [];
  /**
   * Event emitted when the form is submitted with valid data.
   */
  @Output() submitForm = new EventEmitter<{ membershipId: number; paymentCardId: number }>();
  @Input() selectedMembershipId?: number;
  /**
   * Reactive form group for subscription selection.
   */
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tokenStorageService: TokenStorageService,
    private router: Router
    ) {}


  /**
   * Initializes the form and sets the userId and preselected membership if provided.
   */

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

  /**
   * Handles form submission, emitting the selected membership and card.
   */
  onSubmit(): void {
    if (this.form.invalid) return;
    const formValue = this.form.value;
    this.submitForm.emit({
      membershipId: formValue.membershipId,
      paymentCardId: formValue.paymentCardId// si lo necesitas pasar como parte del comando
    });
  }
  /**
   * Selects a payment card by its ID and updates the form control.
   *
   * @param cardId The ID of the selected card.
   */
  selectCard(cardId: number) {
    this.form.get('paymentCardId')?.setValue(cardId);
  }
  /**
   * Gets the currently selected payment card ID.
   */
  get selectedCardId(): number | null {
    return this.form.get('paymentCardId')?.value ?? null;
  }
  /**
   * Navigates to the screen for registering a new payment card.
   */
  goToAddCard() {
    this.router.navigate(['/edit-card']); // O la ruta que tengas para registrar tarjetas
  }
  /**
   * Navigates back to the user profile page.
   */
  goBack() {
    this.router.navigate(['/user-profile']);
  }
}
