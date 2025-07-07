import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user'
import { UserService } from '../../services/user.service';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
import {TranslatePipe} from '@ngx-translate/core';
import {TokenStorageService} from '../../../shared/services/tokenStorage.service';
import {SubscriptionService} from '../../../payment/services/subscription.service';
import {PaymentCardService} from '../../../payment/services/payment-card.service';
import {PaymentCard} from '../../../payment/model/payment-card';
import { CommonModule } from '@angular/common';
/**
 * Represents the user profile page.
 * Displays user information, subscription plan, and payment card status.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  imports: [
    CommonModule,
    MatCard,
    MatButton,
    MatCardTitle,
    MatCardContent,
    ToolbarComponent,
    TranslatePipe
  ],
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  /**
   * The currently authenticated user.
   */
  user: User = new User();
  /**
   * Name of the user's current subscription plan.
   */
  currentPlanName: string= '';

  /**
   * Last four digits of the user's payment card.
   */
  last4Digits: string = '';
  /**
   * Indicates whether the user has at least one saved payment card.
   */
  hasCard: boolean = false;
  /**
   * List of the user's registered payment cards.
   */
  cards: PaymentCard[] = [];
  /**
   * Indicates if the user's current plan is the free 'Starter' plan.
   */
  isFreePlan: boolean = false;

  constructor(private userService: UserService,
              private subscriptionService: SubscriptionService,
              private router: Router,
              private tokenStorageService: TokenStorageService,
              private paymentCardService: PaymentCardService) {}
  /**
   * Initializes the profile page by retrieving user data,
   * payment cards, and subscription details.
   * Redirects to login if no user ID is found.
   */
  ngOnInit(): void {
    const userId = Number(this.tokenStorageService.getUserId());
    console.log('User ID from localStorage:', userId);  // <-- Aquí para verificar el ID

    if (userId) {
      this.userService.getUserById(userId).subscribe(user => {
        console.log('User API response:', user); // <-- Aquí para ver qué devuelve la API
        this.user = user;
        this.paymentCardService.getUserCards(userId).subscribe({
          next: (cards: PaymentCard[]) => {
            this.cards = cards;
            this.hasCard = cards.length > 0;
            if (this.hasCard) {
              this.last4Digits = cards[0].cardNumber.slice(-4); // Opcional si quieres mostrar tarjeta aquí también
            }
          },
          error: err => {
            console.error('Error al obtener tarjetas del usuario:', err);
            this.hasCard = false;
          }
        });



        this.subscriptionService.getUserSubscription(userId).subscribe((subscription: any) => {
          console.log('🔄 Subscripción recibida:', subscription);
          if (subscription && subscription.membership) {
            this.currentPlanName = subscription.membership.name;
            this.isFreePlan = subscription.membership.name.toLowerCase() === 'starter';
            console.log('🧪 isFreePlan:', this.isFreePlan);
            if (subscription.paymentCard) {
              this.last4Digits = subscription.paymentCard.cardNumber.slice(-4);
            } else {
              this.last4Digits = '----'; // No tiene tarjeta (plan gratuito)
            }
          } else {
            this.currentPlanName = 'No plan';
            this.last4Digits = '----';
          }
        });

      }, error => {
        console.error('Error fetching user:', error); // <-- Opcional, para errores
      });
    } else {
      // Si no hay ID, redirigir al login
      this.router.navigate(['/login']);
    }
}

  /**
   * Navigates to the edit profile page.
   */
  goToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }
  /**
   * Navigates to the page to edit payment card information.
   */
  goToEditCardInformation(){
    this.router.navigate(['/edit-card']);
  }

  /**
   * Navigates to the password change page.
   */
  goToEditPassword() {
    this.router.navigate(['/edit-password']);
  }
  /**
   * Deletes the user account after confirmation.
   * Clears storage and redirects to login on success.
   */
  deleteProfile(): void {
    if (confirm('Are you sure you want to delete your account?')) {
      this.userService.deleteUser(this.user.id).subscribe({
        next: () => {
          localStorage.clear(); // O remover token, etc.
          this.router.navigate(['/login']);
          alert('Account deleted');
        },
        error: err => {
          console.error('Error deleting user:', err);
          alert('Error deleting account');
        }
      });
    }
  }
  /**
   * Clears user session and navigates to the login page.
   */
  goToLogin(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  /**
   * Clears user session and navigates to the login page.
   */
  goToUpgrade(): void {
    this.router.navigate(['/purchase']); // Cambia esta ruta según tu app
  }
  /**
   * Logs the user out by clearing token and storage,
   * then redirects to the login page.
   */

  logout() {
    this.tokenStorageService.signOut();
    localStorage.clear();
    window.sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
