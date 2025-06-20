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
import {UploadService} from '../../../shared/services/images.service';
import {TranslatePipe} from '@ngx-translate/core';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';

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
    TranslatePipe,
    ToolbarComponent,
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
   * @param uploadService
   */
  constructor(
    private route: ActivatedRoute,
    private collectionsService: CollectionsService,
    private uploadService: UploadService
  ) {}

  /**
   * @function ngOnInit
   * @description Lifecycle hook that fetches the wish by productId on init.
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productIdParam = params.get('productId');
      this.productId = productIdParam === 'new' ? null : Number(productIdParam);

      if (this.productId !== null) {
        this.getWish(this.productId);
      } else {
        // Create mode
        this.wish = new Wish();
        const collectionIdParam = params.get('collectionId');
        if (collectionIdParam) {
          this.wish.idCollection = Number(collectionIdParam);
        } else {
          console.warn('No se recibió collectionId en la ruta');
        }
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
        if (this.productId) {
          this.wish = wish;
        } else {
          this.wish = new Wish();
        }
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
    if (!this.wish.title || this.wish.title.trim() === '') {
      alert('Por favor ingresa un título');
      return;
    }

    if (!this.wish.idCollection) {
      alert('No se ha establecido una colección válida');
      return;
    }

    if (this.wish.id) {
      // Edit
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
      // Create
      this.collectionsService.createWish(this.wish).subscribe({
        next: (createdWish) => {
          console.log('Wish created:', createdWish);
          history.back();
        },
        error: (err) => {
          console.error('Error creating wish:', err);
        },
      });
    }
  }

  /**
   * @function onFileSelected
   * @description Saves the updated image of item
   */

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Archivo seleccionado:', file);


      this.uploadService.uploadImage(file).subscribe({
        next: res => {
          console.log('Imagen subida correctamente:', res);
          this.wish.urlImg = res.secure_url;
        },
        error: err => {
          console.error('Error al subir imagen a Cloudinary:', err);
        }
      });
    } else {
      console.warn('No se seleccionó ningún archivo');
    }
  }
}
