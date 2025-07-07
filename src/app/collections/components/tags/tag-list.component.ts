import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import {Tag} from '../../model/tag.entity';

/**
 * Component that displays a list of tags using Angular Material chips.
 *
 * This component receives an array of tags and renders each one
 * as a visual chip.
 */
@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [MatChipsModule, CommonModule],
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent {
  /**
   * List of tags to display.
   *
   * Each tag contains a name and a color, rendered as a Material chip.
   */
  @Input() tags: Tag[] = [];
}
