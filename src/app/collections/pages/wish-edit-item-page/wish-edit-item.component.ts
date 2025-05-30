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

/**
 * @component WishEditItemComponent
 * @description
 * Component to edit a Wish item, including its tags.
 * Allows adding/removing tags with autocomplete and chip UI.
 * Saves the wish through the collections service.
 */

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
  /**
   * @property wish
   * @description The Wish entity being edited.
   */
  wish: Wish = new Wish();

  //todo fix autocomplete
  /**
   * @property tagInputValue
   * @description Signal holding the current input value for tag autocomplete.
   */
  tagInputValue = signal('');

  /**
   * @property productId
   * @description The ID of the wish item fetched from the route parameters.
   */
  productId: number | null = 0;

  /**
   * @constructor
   * @param route - ActivatedRoute to get route parameters.
   * @param collectionsService - Service to get/update wish data.
   */
  constructor(
    private route: ActivatedRoute,
    private collectionsService: CollectionsService
  ) {}

  /**
   * @function ngOnInit
   * @description Lifecycle hook that fetches the wish by productId on init.
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.productId = Number(params.get('productId'));

      if (this.productId) {
        this.getWish(this.productId);
      }
    });
  }

  /**
   * @function getWish
   * @description Fetches a Wish by ID and assigns it to the component property.
   * @param productId - The ID of the Wish to fetch.
   */
  private getWish(productId: number): void {
    this.collectionsService.getWishById(productId).subscribe({
      next: (wish: Wish) => {
        this.wish = wish;
        console.log(this.wish); // confirm received data
      },
      error: (err) => {
        console.error('Error fetching wish:', err);
      },
    });
  }

  /**
   * @property separatorKeysCodes
   * @description Key codes to separate input into tags (Enter and Comma).
   */
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  /**
   * @property currentTag
   * @description Model holding the current tag input value.
   */
  readonly currentTag = model('');

  /**
   * @property tags
   * @description Signal holding the current list of tags.
   */
  readonly tags = signal(this.wish.tags);

  /**
   * @property filteredTags
   * @description Computed signal that filters tags based on currentTag input.
   */
  readonly filteredTags = computed(() => {
    const currentTag = this.currentTag().toLowerCase();
    return currentTag
      ? this.wish.tags.filter((tag) =>
        tag.name.toLowerCase().includes(currentTag)
      )
      : this.wish.tags.slice();
  });

  /**
   * @function add
   * @description Adds a new tag to the wish with a random color and clears the input.
   */
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

  /**
   * @function remove
   * @description Removes a tag from the wish.tags array.
   * @param tag - The Tag to remove.
   */
  remove(tag: Tag): void {
    const indexWish = this.wish.tags.indexOf(tag);
    if (indexWish < 0) {
      console.log(`wish.tags: ${tag.name} not found`);
    } else {
      this.wish.tags.splice(indexWish, 1);
      console.log(`wish.tags: Removed ${tag.name}`);
      console.log(this.wish.tags);
    }
  }

  /**
   * @function selected
   * @description Handles tag selection from the autocomplete options.
   * @param event - MatAutocompleteSelectedEvent triggered on selection.
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.update((tags) => [...tags]);
    this.currentTag.set('');
    event.option.deselect();
  }

  /**
   * @function onCancel
   * @description Navigates back to the previous page without saving changes.
   */
  onCancel(): void {
    history.back();
  }

  /**
   * @function onSave
   * @description Saves the updated wish via the service and navigates back on success.
   */
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
        },
      });
    } else {
      console.error('Error saving: wish.id is missing');
    }
  }
}
