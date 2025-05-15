import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { CreationButtonsComponent } from '../../components/creation-buttons/creation-buttons.component';
import { CollectionCardComponent } from '../../components/collection-card/collection-card.component';
import { NgForOf} from '@angular/common';
import { CollectionsService } from '../../services/collections.service';
import { Collection } from '../../model/collection.entity';
import { Wish } from '../../model/wish.entity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collections-grid',
  imports: [
    MatIconModule,
    SidebarComponent,
    SearchBarComponent,
    CreationButtonsComponent,
    CollectionCardComponent,
    NgForOf,
  ],
  templateUrl: './collections-grid.component.html',
  styleUrl: './collections-grid.component.css',
})
export class CollectionsGridComponent implements OnInit {
  collections: { id: string; name: string; items: Wish[] }[] = [];

  constructor(private collectionsService: CollectionsService, private router: Router) {}

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    this.collectionsService.getCollections().subscribe({
      next: (data: Collection[]) => {
        this.collections = data.map(collection => ({
          id: collection.id,
          name: collection.name,
          items: collection.items,
        }));
      },
      error: (error) => {
        console.error('Error al cargar las colecciones:', error);
      }
    });

    console.log(this.collections);
  }

  extractPrimerasCuatroImagenes(items: Wish[]): string[] {
    if (!items) return [];
    return items.slice(0, 4).map(wish => wish.urlImg);
  }

  extractPrimerosTresTags(items: Wish[]): { name: string; color: string }[] {
    if (!items) return [];
    const uniqueTags: { [name: string]: { name: string; color: string } } = {};
    for (const wish of items) {
      if (!wish.tags) continue;
      for (const tag of wish.tags) {
        if (!uniqueTags[tag.name]) {
          uniqueTags[tag.name] = { name: tag.name, color: tag.color || '#e0f7fa' };
        }
        if (Object.keys(uniqueTags).length >= 3) break;
      }
      if (Object.keys(uniqueTags).length >= 3) break;
    }
    return Object.values(uniqueTags).slice(0, 3);
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
  navigateToCollection(id: string): void {
    this.router.navigate(['/collections', id]);
  }

}
