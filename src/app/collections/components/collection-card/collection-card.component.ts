import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgForOf, NgStyle, NgIf } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-collection-card',
  standalone: true,
  imports: [NgForOf, NgIf, MatChipsModule, NgClass, NgStyle, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.css'],
})
export class CollectionCardComponent {
  @Input() name: string = '';
  @Input() imageUrls: string[] = [];
  @Input() tags: { name: string; color: string }[] = [];
  @Input() collection: any; // Puedes tipar esto con tu entidad Collection si la tienes disponible
  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() share = new EventEmitter<any>();

  get displayedTags(): { name: string; color: string }[] {
    return this.tags.slice(0, 3);
  }

  onDelete(): void {
    this.delete.emit(this.collection);
  }

  onEdit(): void {
    this.edit.emit(this.collection);
  }

  onShare(): void {
    this.share.emit(this.collection);
  }
}
