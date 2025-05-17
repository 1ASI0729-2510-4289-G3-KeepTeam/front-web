import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Wish } from '../../model/wish.entity';
import { CollectionsService } from '../../services/collections.service';
import { ActivatedRoute } from '@angular/router';
import { Collection } from '../../model/collection.entity';

/**
 * @component CollectionEditComponent
 * @description
 * Provides an interface to edit a collection's name and display its items.
 * Fetches collection data and related wishes from the CollectionsService based on route parameters.
 * Allows selecting a color theme for the collection and previewing up to four images from the items.
 */
@Component({
  selector: 'app-collection-edit',
  standalone: true,
  templateUrl: './collection-edit.component.html',
  styleUrls: ['./collection-edit.component.css'],
  imports: [CommonModule, FormsModule]
})
export class CollectionEditComponent {

  /**
   * @property selectedCollection
   * @description Currently selected collection being edited.
   */
  selectedCollection!: Collection;

  /**
   * @input collectionName
   * @description Two-way bound collection name input for editing.
   */
  @Input() collectionName: string = '';

  /**
   * @input selectedColor
   * @description Currently selected color for the collection theme.
   */
  @Input() selectedColor: string = '';

  /**
   * @input items
   * @description List of wishes/items belonging to the selected collection.
   */
  @Input() items: Wish[] = [];

  /**
   * @property imageUrls
   * @description Array of URLs for preview images extracted from the collection's items.
   */
  imageUrls: string[] = [];

  /**
   * @property colors
   * @description Predefined color options available for collection theming.
   */
  colors: { value: string; label: string; hex: string; bg: string }[] = [
    { value: 'Cream', label: 'Cream', hex: '#f8f3ed', bg: '#f8f3ed' },
    { value: 'Naranja', label: 'Naranja', hex: '#fbd9b8', bg: '#fbd9b8' },
    { value: 'Lemon', label: 'Lemon', hex: '#fdf8c0', bg: '#fdf8c0' },
    { value: 'Sky', label: 'Sky', hex: '#c9e6f9', bg: '#c9e6f9' }
  ];

  /**
   * @constructor
   * @param collectionsService - Service to interact with collection data.
   * @param route - ActivatedRoute for accessing route parameters.
   */
  constructor(
    private collectionsService: CollectionsService,
    private route: ActivatedRoute
  ) {}

  /**
   * @function ngOnInit
   * @description Lifecycle hook that initializes the component.
   * Retrieves the collection ID from the route and fetches its data and related items.
   */
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.collectionsService.getCollectionById(id).subscribe(collection => {
        this.selectedCollection = collection;
        this.collectionName = collection.title;
        this.collectionsService.getProductsByIdCollection(id).subscribe(items => {
          this.items = items;
          this.imageUrls = this.extractFirstFourImages(this.items);
        });
        console.log('Collection received:', collection);
      });
    }
  }

  /**
   * @function goBack
   * @description Navigates back to the previous page in browser history.
   */
  goBack() {
    window.history.back();
  }

  /**
   * @function setColor
   * @description Sets the selected color for the collection.
   * @param color - The color value to set.
   */
  setColor(color: string) {
    this.selectedColor = color;
  }

  /**
   * @function save
   * @description Saves changes to the collection's title by calling the CollectionsService.
   * Handles success and error responses.
   */
  save() {
    if (!this.selectedCollection) return;

    const id = this.selectedCollection.id;
    const newTitle = this.collectionName;

    this.collectionsService.updateCollectionTitle(id, newTitle).subscribe({
      next: updatedCollection => {
        console.log('Collection title updated:', updatedCollection);
        this.selectedCollection = updatedCollection;
      },
      error: err => {
        console.error('Error updating collection title:', err);
      }
    });
  }

  /**
   * @function cancel
   * @description Cancels editing and navigates back.
   */
  cancel() {
    console.log('Cancelled');
    this.goBack();
  }

  /**
   * @function getSelectedBgColor
   * @description Returns the background color hex code of the selected color.
   * @returns {string} The background color hex or white if no match.
   */
  getSelectedBgColor(): string {
    const colorObj = this.colors.find(c => c.value === this.selectedColor);
    return colorObj ? colorObj.bg : '#fff';
  }

  /**
   * @function extractFirstFourImages
   * @description Extracts up to the first four image URLs from a list of wishes.
   * @param items - Array of Wish objects.
   * @returns {string[]} Array of image URLs.
   */
  extractFirstFourImages(items: Wish[]): string[] {
    if (!items) return [];
    return items.slice(0, 4).map(wish => wish.urlImg);
  }
}
