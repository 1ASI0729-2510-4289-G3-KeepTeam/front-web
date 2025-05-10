import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-collection-edit',
  standalone: true,
  templateUrl: './collection-edit.component.html',
  styleUrls: ['./collection-edit.component.css'],
  imports: [CommonModule, FormsModule]
})
export class CollectionEditComponent {
  collectionName = 'Dog Things';
  selectedColor = 'Cream';



  colors : { value: string, label: string, hex: string, bg: string }[] = [
    { value: 'Cream', label: 'Cream', hex: '#f8f3ed', bg: '#f8f3ed' },
    { value: 'Naranja', label: 'Naranja', hex: '#fbd9b8', bg: '#fbd9b8' },
    { value: 'Lemon', label: 'Lemon', hex: '#fdf8c0', bg: '#fdf8c0' },
    { value: 'Sky', label: 'Sky', hex: '#c9e6f9', bg: '#c9e6f9' }
  ];

  goBack() {
    window.history.back();
  }

  setColor(selectedColor: string) {
    this.selectedColor = selectedColor;
  }

  save() {
    console.log('Saved:', this.collectionName, this.selectedColor);
  }

  cancel() {
    console.log('Cancelled');
  }

  getSelectedBgColor() {
    const colorObj = this.colors.find(c => c.value === this.selectedColor);
    return colorObj ? colorObj.bg : '#fff';
  }
}


