import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user'
import { UserService } from '../../services/user.service';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  imports: [
    MatCard,
    MatButton,
    MatCardTitle,
    MatCardContent,
    RouterLink
  ],
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User = new User();
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (userId) {
      this.userService.getUserById(userId).subscribe(user => {
        this.user = user;
      });
    } else {
      // Si no hay ID, lo más seguro es redirigir al login
      this.router.navigate(['/login']);
    }
}
  goToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }
}
