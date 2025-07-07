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
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {TokenStorageService} from '../../../shared/services/tokenStorage.service';

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
  imports: [CommonModule, FormsModule, ToolbarComponent,TranslatePipe]
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
    { value: 'Cream', label: 'colors.cream', hex: '#f8f3ed', bg: '#f8f3ed' },
    { value: 'Naranja', label: 'colors.orange', hex: '#fbd9b8', bg: '#fbd9b8' },
    { value: 'Lemon', label: 'colors.lemon', hex: '#fdf8c0', bg: '#fdf8c0' },
    { value: 'Sky', label: 'colors.sky', hex: '#c9e6f9', bg: '#c9e6f9' }
  ];


  /**
   * @constructor
   * @param collectionsService - Service to interact with collection data.
   * @param route - ActivatedRoute for accessing route parameters.
   * @param router - Angular Router for programmatic navigation.
   * @param translate - TranslateService for internationalization.
   *
   */
  constructor(
    private collectionsService: CollectionsService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,// Injected TranslateService
    private tokenStorageService: TokenStorageService) {}

  /**
   * @function ngOnInit
   * @description Lifecycle hook that initializes the component.
   * Retrieves the collection ID from the route and fetches its data and related items.
   * Handles both editing existing collections and creating new ones.
   */
  ngOnInit() {
    const idParam: string | null = this.route.snapshot.paramMap.get('id');
    const id: number = idParam === 'new' ? 0 : Number(idParam);

    if (id === 0) {
      this.selectedCollection = new Collection();
      this.selectedCollection.id = 0;
      this.selectedCollection.title = '';
      this.selectedCollection.idUser = this.tokenStorageService.getUserId();
      const parentId = Number(this.route.snapshot.queryParamMap.get('parentId')) || 0;
      this.selectedCollection.idParentCollection = parentId;

      this.collectionName = this.selectedCollection.title;
      this.items = [];
      this.imageUrls = [];
      console.log('Inicializando para crear una nueva colección. parentId:', parentId);
      console.log('ID de colección a consultar:', this.selectedCollection.id); // o como se llame en tu componente

    } else {
      this.collectionsService.getCollectionById(id).subscribe(
        collection => {
          this.selectedCollection = collection;
          this.collectionName = collection.title;

          this.collectionsService.getProductsByIdCollection(id).subscribe(items => {
            this.items = items;
            this.imageUrls = this.extractFirstFourImages(this.items);

          });
          console.log('Colección recibida para edición:', collection);
        },
        error => {
          console.error('Error al cargar la colección:', error);
          this.router.navigate(['/collections']);
        }
      );
    }
  }


  /**
   * @function goBack
   * @description Navigates back to the main collections page for consistent navigation.
   */
  goBack() {
    this.router.navigate(['/collections']);
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
