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
  userId!: number;
  cards: PaymentCard[] = [];
  memberships: Membership[] = [];
  selectedMembershipId?: number;

  constructor(
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionService,
    private membershipService: MembershipService,
    private paymentCardService: PaymentCardService,
    private tokenStorageService: TokenStorageService,
    private router: Router,


  ) {}

  ngOnInit(): void {
    const userIdString = this.tokenStorageService.getUserId();
    this.userId = Number(userIdString);

    // ✅ Verifica que no sea NaN o 0
    if (!this.userId || isNaN(this.userId)) {
      console.error('User ID inválido:', userIdString);
      return;
    }

    const membershipIdParam = this.route.snapshot.queryParamMap.get('membershipId');
    this.selectedMembershipId = membershipIdParam ? Number(membershipIdParam) : undefined;

    this.membershipService.getAll().subscribe(data => {
      this.memberships = data;
    });

    this.paymentCardService.getUserCards(this.userId).subscribe({
      next: data => this.cards = data,
      error: err => console.error('Error al obtener tarjetas:', err)
    });
  }

  onSubmit({ membershipId, paymentCardId }: { membershipId: number; paymentCardId: number }) {
    console.log('Enviando suscripción:', {
      userId: this.userId,
      membershipId,
      paymentCardId
    });
    this.subscriptionService
      .createSubscription({ userId: this.userId, membershipId, paymentCardId })
      .subscribe({
        next: () => {alert('✅ Suscripción creada correctamente'),
          this.router.navigate(['/user-profile']);
        },
        error: () => alert('❌ Error al crear la suscripción')
      });
  }
}
