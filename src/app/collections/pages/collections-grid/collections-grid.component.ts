import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { CreationButtonsComponent } from '../../components/creation-buttons/creation-buttons.component';
import { CollectionCardComponent } from '../../components/collection-card/collection-card.component'; // Importa el nuevo componente
import { NgForOf } from '@angular/common';

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
export class CollectionsGridComponent {
  collections = [
    {
      title: 'Dog Things',
      imageUrls: [
        'https://media.falabella.com/falabellaPE/118072529_01/w=1500,h=1500,fit=pad',
        'https://media.falabella.com/falabellaPE/118072529_01/w=1500,h=1500,fit=pad',
        'https://media.falabella.com/falabellaPE/118072529_01/w=1500,h=1500,fit=pad',
        'https://media.falabella.com/falabellaPE/118072529_01/w=1500,h=1500,fit=pad',
      ],
      tags: [
        { name: 'Mascot', color: '#e1f5fe' },
        { name: 'Furniture', color: '#f3e5f5' },
        { name: 'Inspo', color: '#fff3e0' },
      ],
    },
    {
      title: 'Cat Things',
      imageUrls: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
      tags: [
        { name: 'Muebles', color: '#f3e5f5' },
        { name: 'Hogar', color: '#fff3e0' },
      ],
    },
    {
      title: 'Colección de Arte',
      imageUrls: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
      tags: [
        { name: 'Arte', color: '#fff3e0' },
        { name: 'Pintura', color: '#e0f7fa' },
        { name: 'Escultura', color: '#e1f5fe' },
      ],
    },
    {
      title: 'Nueva Colección',
      imageUrls: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
      tags: [
        { name: 'Tag 1', color: '#abcdef' },
        { name: 'Tag 2', color: '#fedcba' },
        { name: 'Tag 3', color: '#abcdef' },
        { name: 'Tag 4', color: '#fedcba' },
      ],
    },
  ];
}
