import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [MatChipsModule, CommonModule],
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent {

  //aqui pasamos los tags con nombre y color
  tags = [
    { name: 'Mascot', color: '#e1f5fe' },
    { name: 'Furniture', color: '#f3e5f5' },
    { name: 'Dog', color: '#fff3e0' }
  ];
}
