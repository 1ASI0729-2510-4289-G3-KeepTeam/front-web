import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Collection} from '../../model/collection.entity';
import {Wish} from '../../model/wish.entity';
/**
 * @component SidebarComponent
 * @description
 * Component of sidebar menu displaying user collections.
 * Each collection is rendered with its name and a linked image preview.
 */

@Component({
  selector: 'app-sidebar',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  /**
   * @property nav
   * @description
   * Navigation structure for the sidebar. Contains a list of grouped items
   * where each item represents a user collection or item with a name and image URL.
   */
  @Input() titleName: String | undefined;
  @Input() nav: any | undefined;

  constructor(private router: Router, private route: ActivatedRoute) {}

  goToItem(item: Collection | Wish) {
    let baseRoute = this.route.snapshot.url[0]?.path;

    if(this.route.snapshot.url[1]) {
      baseRoute = baseRoute + '/' + this.route.snapshot.url[1].path;
    }
    this.router.navigate([baseRoute , item.id]);

  }
}
