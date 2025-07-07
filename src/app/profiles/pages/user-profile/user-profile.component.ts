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


@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  imports: [
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
  user: User = new User();
  currentPlanName: string= '';
  last4Digits: string = '';
  constructor(private userService: UserService,
              private subscriptionService: SubscriptionService,
              private router: Router,
              private tokenStorageService: TokenStorageService) {}

  ngOnInit(): void {
    const userId = Number(this.tokenStorageService.getUserId());
    console.log('User ID from localStorage:', userId);  // <-- Aquí para verificar el ID

    if (userId) {
      this.userService.getUserById(userId).subscribe(user => {
        console.log('User API response:', user); // <-- Aquí para ver qué devuelve la API
        this.user = user;
        this.subscriptionService.getUserSubscription(userId).subscribe((subscription: any) => {
          if (subscription && subscription.membership && subscription.paymentCard) {
            this.currentPlanName = subscription.membership.name;
            this.last4Digits = subscription.paymentCard.cardNumber.slice(-4);
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
  goToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  goToEditCardInformation(){
    this.router.navigate(['/edit-card']);
  }
  goToEditPassword() {
    this.router.navigate(['/edit-password']);
  }

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

  goToLogin(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  logout() {
    this.tokenStorageService.signOut();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
