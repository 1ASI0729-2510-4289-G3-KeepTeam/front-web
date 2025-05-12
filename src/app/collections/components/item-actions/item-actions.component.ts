import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, Router } from '@angular/router';
import { Wish } from '../../model/wish.entity';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-item-actions',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink, MatMenuModule],
  templateUrl: './item-actions.component.html',
  styleUrl: './item-actions.component.css',
})
export class ItemActionsComponent {
  @Input() wish: Wish | undefined;

  constructor(private router: Router) { }

  shareAsQR() {
    const link = `wish-qr-share/:id${this.wish?.id}`;
    this.router.navigate([link]);
    console.log(`Compartiendo como QR el deseo con ID: ${this.wish?.id}`);
  }

  copyLink() {
    const link = `/wish/share/id${this.wish?.id}`;
    this.router.navigate([link]);
  }
}
