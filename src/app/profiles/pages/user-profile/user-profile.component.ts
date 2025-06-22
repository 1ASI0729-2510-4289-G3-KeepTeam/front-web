import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user'
import { UserService } from '../../services/user.service';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCard,
    MatButton,
    MatCardTitle,
    MatCardContent,
    TranslatePipe,
    ToolbarComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User = new User();
  constructor(
    private userService: UserService,
    private router: Router,
    private translate: TranslateService // Inject TranslateService
  ) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    console.log('User ID from localStorage:', userId);

    if (userId) {
      this.userService.getUserById(userId).subscribe(user => {
        console.log('User API response:', user);
        this.user = user;
      }, error => {
        console.error('Error fetching user:', error);

        this.router.navigate(['/login']);
      });
    } else {
      // If no ID, redirect to login
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

    this.translate.get('profile.deleteProfileSuccess').subscribe((message: string) => {

      alert(message);
      this.userService.deleteUser(this.user.id).subscribe(() => {
        this.router.navigate(['/login']);
      }, error => {
        console.error('Error deleting profile:', error);

      });
    });
  }

  goToLogin(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
