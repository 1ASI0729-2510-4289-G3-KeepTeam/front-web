import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user'
import { UserService } from '../../services/user.service';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';

@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  imports: [
    MatCard,
    MatButton,
    MatCardTitle,
    MatCardContent,
    ToolbarComponent
  ],
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User = new User();
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    console.log('User ID from localStorage:', userId);  // <-- Aquí para verificar el ID

    if (userId) {
      this.userService.getUserById(userId).subscribe(user => {
        console.log('User API response:', user); // <-- Aquí para ver qué devuelve la API
        this.user = user;
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
    this.userService.deleteUser(this.user.id).subscribe(() => {
      alert('Profile deleted successfully!');
      this.router.navigate(['/login']); // o tu ruta de perfil
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

}
