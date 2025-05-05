import { Component, Input } from '@angular/core';
import {NgClass, NgForOf, NgStyle} from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-collection-card',
  standalone: true,
  imports: [NgForOf, MatChipsModule, NgClass, NgStyle],
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.css']
})
export class CollectionCardComponent {
  @Input() name: string = '';
  @Input() imageUrls: string[] = [];
  @Input() tags: { name: string; color: string }[] = [];

  // Limitar a mostrar solo las primeras 3 etiquetas
  get displayedTags(): { name: string; color: string }[] {
    return this.tags.slice(0, 3);
  }
}
