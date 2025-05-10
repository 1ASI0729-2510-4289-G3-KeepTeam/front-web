import { Component, Input } from '@angular/core';
// import { CardResponse } from '../../services/card-response';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-item-card',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './product-item-card.component.html',
  styleUrl: './product-item-card.component.css',
})
export class ProductItemCardComponent {
  // @Input() card!: CardResponse;
  // @Input() id: string = '';
  @Input() imageUrl: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  // "title": "Dog Bed",
  // "description": "Really comfy bed",
}
