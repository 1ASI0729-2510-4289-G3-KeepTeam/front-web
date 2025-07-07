import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { MembershipService } from '../../services/membership.service';
import { PaymentCardService } from '../../services/payment-card.service';
import { PaymentCard } from '../../model/payment-card';
import { Membership } from '../../model/membership';
import { SubscriptionFormComponent } from '../../components/subscription-form/subscription-form.component';
import {TokenStorageService} from '../../../shared/services/tokenStorage.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

/**
 * Component responsible for handling the subscription purchase flow.
 * It loads available memberships, payment cards, and optionally a preselected membership.
 * It also detects if the user has an existing subscription and handles both creation and upgrade.
 */
@Component({
  selector: 'app-purchase-subscription',
  template: `
    <app-subscription-form
      [userId]="userId"
      [memberships]="memberships"
      [cards]="cards"
      [selectedMembershipId]="selectedMembershipId"
      (submitForm)="onSubmit($event)">
    </app-subscription-form>
  `,
  standalone: true,
  imports: [SubscriptionFormComponent]
})
export class PurchaseSubscriptionComponent implements OnInit {
  /**
   * ID of the current user.
   */
  userId!: number;
  /**
   * List of the user's saved payment cards.
   */
  cards: PaymentCard[] = [];

  /**
   * List of available membership plans.
   */
  memberships: Membership[] = [];
  /**
   * Membership ID preselected from route query parameters.
   */
  selectedMembershipId?: number;
  /**
   * ID of the existing subscription, if any.
   */
  existingSubscriptionId: number | null = null;


  constructor(
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionService,
    private membershipService: MembershipService,
    private paymentCardService: PaymentCardService,
    private tokenStorageService: TokenStorageService,
    private router: Router,


  ) {}
  /**
   * Lifecycle method that initializes user ID, loads memberships, user cards,
   * and checks for existing subscriptions.
   */
  ngOnInit(): void {
    const userIdString = this.tokenStorageService.getUserId();
    this.userId = Number(userIdString);


    if (!this.userId || isNaN(this.userId)) {
      console.error('User ID inválido:', userIdString);
      return;
    }

    const membershipIdParam = this.route.snapshot.queryParamMap.get('membershipId');
    this.selectedMembershipId = membershipIdParam ? Number(membershipIdParam) : undefined;

    this.membershipService.getAll().subscribe(data => {
      this.memberships = data;
    });

    this.subscriptionService.getUserSubscription(this.userId).subscribe({
      next: (subscription: any) => {
        this.existingSubscriptionId = subscription.id; // guarda el ID para el PUT
      },
      error: () => {
        this.existingSubscriptionId = null; // no tiene suscripción
      }
    });

    this.paymentCardService.getUserCards(this.userId).subscribe({
      next: data => this.cards = data,
      error: err => console.error('Error al obtener tarjetas:', err)
    });
  }
  /**
   * Handles the form submission event.
   * Decides between creating a new subscription or upgrading an existing one.
   *
   * @param membershipId The selected membership ID.
   * @param paymentCardId The selected payment card ID.
   */
  onSubmit({ membershipId, paymentCardId }: { membershipId: number; paymentCardId: number }) {
    const request = {
      userId: this.userId,
      membershipId,
      paymentCardId
    };

    if (this.existingSubscriptionId) {
      // Si ya tiene una suscripción, hacer PUT (upgrade)
      this.subscriptionService
        .upgradePlan(this.existingSubscriptionId, request)
        .subscribe({
          next: () => {
            alert('✅ Suscripción actualizada correctamente');
            this.router.navigate(['/user-profile']);
          },
          error: () => alert('❌ Error al actualizar la suscripción')
        });
    } else {
      // Si no tiene una suscripción, hacer POST (crear)
      this.subscriptionService
        .createSubscription(request)
        .subscribe({
          next: () => {
            alert('✅ Suscripción creada correctamente');
            this.router.navigate(['/user-profile']);
          },
          error: () => alert('❌ Error al crear la suscripción')
        });
    }
  }

}
