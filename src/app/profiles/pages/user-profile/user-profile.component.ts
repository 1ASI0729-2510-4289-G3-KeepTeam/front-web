import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user'
import { UserService } from '../../services/user.service';
import {MatCard} from '@angular/material/card';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  imports: [
    MatCard,
    MatButton
  ],
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User = new User();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const userId = 124;
    this.userService.getUserById(userId).subscribe(user => {
      this.user = user;
    });
  }
}
