import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import {Tag} from '../../model/tag.entity';



@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [MatChipsModule, CommonModule],
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent {
  @Input() tags: Tag[] = [];
}
