import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Wish} from '../../model/wish.entity';
import {CollectionsService} from '../../services/collections.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Collection} from '../../model/collection.entity';


@Component({
  selector: 'app-collection-edit',
  standalone: true,
  templateUrl: './collection-edit.component.html',
  styleUrls: ['./collection-edit.component.css'],
  imports: [CommonModule, FormsModule]
})
export class CollectionEditComponent {

  constructor(private collectionsService: CollectionsService, private route: ActivatedRoute) {}

  selectedCollection!: Collection;

  @Input() collectionName: string = '';
  @Input() selectedColor: string = '';
  @Input() items: Wish[] = [];

  imageUrls: string[] = [];

  colors: { value: string, label: string, hex: string, bg: string }[] = [
    { value: 'Cream', label: 'Cream', hex: '#f8f3ed', bg: '#f8f3ed' },
    { value: 'Naranja', label: 'Naranja', hex: '#fbd9b8', bg: '#fbd9b8' },
    { value: 'Lemon', label: 'Lemon', hex: '#fdf8c0', bg: '#fdf8c0' },
    { value: 'Sky', label: 'Sky', hex: '#c9e6f9', bg: '#c9e6f9' }
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.collectionsService.getCollectionById(id).subscribe(collection => {
        this.selectedCollection = collection;
        this.collectionName = collection.name;
        this.collectionsService.getProductsByIdCollection(id).subscribe(items => {
          this.items = items;
          this.imageUrls = this.extractPrimerasCuatroImagenes(this.items);
        });
        console.log('Collection recibida:', collection);
      });

    }
  }

  goBack() {
    window.history.back();
  }

  setColor(color: string) {
    this.selectedColor = color;
  }


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

  cancel() {
    console.log('Cancelled');
    this.goBack();
  }

  getSelectedBgColor() {
    const colorObj = this.colors.find(c => c.value === this.selectedColor);
    return colorObj ? colorObj.bg : '#fff';
  }

  extractPrimerasCuatroImagenes(items: Wish[]): string[] {
    if (!items) return [];
    return items.slice(0, 4).map(wish => wish.urlImg);
  }
}

