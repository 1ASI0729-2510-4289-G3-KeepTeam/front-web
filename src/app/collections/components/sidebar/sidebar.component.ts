import {Component, Input, OnInit } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Collection} from '../../model/collection.entity';
import {Wish} from '../../model/wish.entity';
import {TranslatePipe} from '@ngx-translate/core';
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
    NgIf,
    TranslatePipe
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  /**
   * @property nav
   * @description
   * Navigation structure for the sidebar. Contains a list of grouped items
   * where each item represents a user collection or item with a name and image URL.
   */
  @Input() collection: Collection | undefined;
  @Input() nav: any | undefined;
  @Input() subCollections: Collection[] = [];

  @Input() title: string | undefined;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  goToItem(item: Collection | Wish) {

    console.log('subCollections',this.subCollections);
    if(this.subCollections.length > 0){
      if (!(item instanceof Wish)) {
        this.router.navigate(['/collections', item.id]);
        return
      }
    }

    let baseRoute = this.route.snapshot.url[0]?.path;

    if (this.route.snapshot.url[1]) {
      baseRoute = baseRoute + '/' + this.route.snapshot.url[1].path;
    }
    this.router.navigate([baseRoute, item.id]);

  }
}
