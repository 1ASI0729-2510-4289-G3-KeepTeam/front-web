import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Wish } from '../../model/wish.entity';
import { CollectionsService } from '../../services/collections.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Collection } from '../../model/collection.entity';
import {MatButton} from '@angular/material/button';
import {Observable} from 'rxjs';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';

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
  imports: [CommonModule, FormsModule, ToolbarComponent,MatButton]
})
export class CollectionEditComponent implements OnInit {

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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * @function ngOnInit
   * @description Lifecycle hook that initializes the component.
   * Retrieves the collection ID from the route and fetches its data and related items.
   */
  ngOnInit() {
    const collectionIdParam = this.route.snapshot.paramMap.get('collectionId');
    const isCreating = this.route.snapshot.routeConfig?.path === 'collections/create';

    if (isCreating) {
      this.selectedCollection = new Collection();
      this.selectedCollection.id = 0;
      this.selectedCollection.title = '';
      this.selectedCollection.color = this.colors[0].value;

      const parentId = this.route.snapshot.queryParamMap.get('parentId');
      this.selectedCollection.idParentCollection = parentId ? Number(parentId) : 0;

      this.collectionName = this.selectedCollection.title;
      this.selectedColor = this.selectedCollection.color;
      this.items = [];
      this.imageUrls = [];
      console.log('Inicializando para crear una nueva colección con parentId:', this.selectedCollection.idParentCollection);
    } else if (collectionIdParam) {
      const id = Number(collectionIdParam);
      this.collectionsService.getCollectionById(id).subscribe(
        collection => {
          this.selectedCollection = collection;
          this.collectionName = collection.title;
          this.selectedColor = collection.color || this.colors[0].value;

          this.collectionsService.getProductsByIdCollection(id).subscribe(items => {
            this.items = items;
            this.imageUrls = this.extractFirstFourImages(this.items);
          });
        },
        error => {
          console.error('Error al cargar la colección:', error);
          this.router.navigate(['/collections']);
        }
      );
    }}


  /**
   * @function goBack
   * @description Navigates back to the main collections page for consistent navigation.
   */
  goBack() {
    this.router.navigate(['/collections']);
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
   * @description Saves changes to the collection's title and color.
   * If it's a new collection, it creates it. Otherwise, it updates.
   * Handles success and error responses and navigates back to the main collections page.
   */
  save() {
    if (!this.selectedCollection) {
      console.error('No hay colección seleccionada para guardar.');
      return;
    }

    this.selectedCollection.title = this.collectionName;
    this.selectedCollection.color = this.selectedColor;


    let saveObservable: Observable<Collection>;

    if (this.selectedCollection.id === 0) {
      console.log('Intentando crear nueva colección:', this.selectedCollection);
      saveObservable = this.collectionsService.createCollection(this.selectedCollection);
    } else {
      console.log('Intentando actualizar colección:', this.selectedCollection);
      saveObservable = this.collectionsService.updateCollection(this.selectedCollection);
    }

    saveObservable.subscribe({
      next: (responseCollection) => {
        console.log('Colección guardada/actualizada exitosamente:', responseCollection);
        history.back()
      },
      error: (err) => {
        console.error('Error al guardar/actualizar la colección:', err);
      }
    });
  }


  /**
   * @function cancel
   * @description Cancels editing and navigates back.
   */
  cancel() {
    console.log('Edición cancelada.');
    history.back()
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
