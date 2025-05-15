import {Component, signal, computed, model, OnInit,} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Tag } from '../../model/tag.entity';
import {  NgForOf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent,} from '@angular/material/autocomplete';
import {MatChipsModule } from '@angular/material/chips';
import {CollectionsService} from '../../services/collections.service';
import {Wish} from '../../model/wish.entity';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-edit-wish-item',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatAutocompleteModule,
    NgForOf,
  ],
  templateUrl: './wish-edit-item.component.html',
  styleUrl: './wish-edit-item.component.css',
})
export class WishEditItemComponent implements OnInit {

  wish: Wish = new Wish();
  tagInputValue = signal('');
  productId: string | null = '';

  constructor(
    private route: ActivatedRoute, // obtaining parameters from route
    private collectionsService: CollectionsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('productId');

      if (this.productId) {
        this.getWish(this.productId)
      }
    });
  }

  private getWish(productId: string): void {
    this.collectionsService.getWishById(productId).subscribe({
      next: (wish: Wish) => {
        this.wish = wish;
        console.log(this.wish); //confirm received data
      },
      error: (err) => {
        console.error('Error al obtener el wish:', err);
      },
    });
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentTag = model('');
  readonly tags = signal(this.wish.tags);
  readonly filteredTags = computed(() => {
    const currentTag = this.currentTag().toLowerCase();
    return currentTag
      ? this.wish.tags.filter((tag) =>
        tag.name.toLowerCase().includes(currentTag) //only from tags in wish
      )
      : this.wish.tags.slice();
  });

  add(): void {
    const value = this.tagInputValue().trim();
    if (value) {
      const colors = ['#FFC8DF', '#C8FDFF', '#CAFFC8'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const tag = new Tag();
      tag.name = value;
      tag.color = randomColor;

      this.tags.update((tags) => [...tags, tag]);

      if (!this.wish.tags.some((t) => t.name === tag.name)) {
        this.wish.tags.push(tag);
      }
    }

    this.tagInputValue.set('');
  }

  remove(tag: Tag): void {
    // Eliminar de wish.tags
    const indexWish = this.wish.tags.indexOf(tag);
    if (indexWish < 0) {
      console.log(`wish.tags: ${tag.name} not found`);
    } else {
      this.wish.tags.splice(indexWish, 1);
      console.log(`wish.tags: Removed ${tag.name}`);
      console.log(this.wish.tags);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    // Actualizar las tags al seleccionar una opción
    this.tags.update((tags) => [...tags]);
    this.currentTag.set('');
    event.option.deselect();
  }

  onCancel(): void {
    history.back();
  }


  onSave(): void {
    console.log('Saving wish:', this.wish);
    if (this.wish.id) {
      this.collectionsService.updateWish(this.wish).subscribe({
        next: (updatedWish) => {
          console.log('Wish updated:', updatedWish);
          history.back();
        },
        error: (err) => {
          console.error('Error updating wish:', err);
        }
      });
    } else {
        console.error('Error adding because of wish.id');
    }
}}
