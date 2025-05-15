import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { CreationButtonsComponent } from '../../components/creation-buttons/creation-buttons.component';
import { CollectionCardComponent } from '../../components/collection-card/collection-card.component';
import { NgForOf, SlicePipe } from '@angular/common';
import { CollectionsService } from '../../services/collections.service';
import { Collection } from '../../model/collection.entity';
import { Wish } from '../../model/wish.entity';

@Component({
  selector: 'app-collections-grid',
  imports: [
    MatIconModule,
    SidebarComponent,
    SearchBarComponent,
    CreationButtonsComponent,
    CollectionCardComponent,
    NgForOf,
    SlicePipe,
  ],
  templateUrl: './collections-grid.component.html',
  styleUrl: './collections-grid.component.css',
})
export class CollectionsGridComponent implements OnInit {
  collections: { id: string; name: string; items: Wish[] }[] = [];

  constructor(private collectionsService: CollectionsService) {}

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    this.collectionsService.getCollections().subscribe(
      (data: Collection[]) => {
        this.collections = data.map(collection => ({
          id: collection.id,
          name: collection.name,
          items: collection.items,
        }));
      },
      (error) => {
        console.error('Error al cargar las colecciones:', error);
      }
    );
  }

  extractPrimerasCuatroImagenes(items: Wish[]): string[] {
    return items.slice(0, 4).map(wish => wish.url);
  }

  extractPrimerosTresTags(items: Wish[]): { name: string; color: string }[] {
    return items.slice(0, 3)
      .filter(wish => wish.tags && wish.tags.length > 0)
      .map(wish => ({ name: wish.tags[0]?.name || 'Sin Tag', color: wish.tags[0]?.color || '#e0f7fa' }));
  }

  deleteCollection(collection: any): void {
    console.log('Eliminar colección:', collection);

  }

  editCollection(collection: any): void {
    console.log('Editar colección:', collection);

  }

  shareCollection(collection: any): void {
    console.log('Compartir colección:', collection);

  }
}
