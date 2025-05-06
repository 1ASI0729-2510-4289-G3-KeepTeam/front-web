import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import {Tag} from '../../../collections/model/tag.entity';



@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [MatChipsModule, CommonModule],
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent {

  // Ejemplo
  // tags = [
  //   { name: 'Mascot', color: '#e1f5fe' },
  //   { name: 'Furniture', color: '#f3e5f5' },
  //   { name: 'Dog', color: '#fff3e0' }
  // ];

  @Input() tags: Tag[] = [];
}
