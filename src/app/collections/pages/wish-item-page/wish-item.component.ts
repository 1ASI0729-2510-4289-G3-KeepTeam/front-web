import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ItemActionsComponent } from '../../components/item-actions/item-actions.component';
import { Wish } from '../../model/wish.entity';
import { Tag } from '../../model/tag.entity';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TagListComponent } from '../../../public/components/tags/tag-list.component';
import {WishQrShareComponent} from '../wish-qr-share-page/wish-qr-share.component';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-wish-item',
  imports: [
    MatIconModule,
    ItemActionsComponent,
    DatePipe,
    MatButtonModule,
    TagListComponent,
    WishQrShareComponent,
    RouterLink,
  ],
  templateUrl: './wish-item.component.html',
  styleUrl: './wish-item.component.css'
})
export class WishItemComponent {

  tagsExample: Tag[] = [];
  wish: Wish = new Wish();

  constructor(private router: Router) {
    this.construct();
  }

  construct() {
    const tag1 = new Tag();
    tag1.name = 'Plushies';
    tag1.color = '#FFC8DF';

    const tag2 = new Tag();
    tag2.name = 'Blue Pallete';
    tag2.color = '#C8FDFF';

    const tag3 = new Tag();
    tag3.name = 'Masterpieces';
    tag3.color = '#CAFFC8';

    this.tagsExample.push(tag1, tag2, tag3, tag3);

    this.wish.id = '123lalele';
    this.wish.title = 'Miku Plushie';
    this.wish.description = 'A miku plushie, very affordable, very blue, i like blue things, thats the only reason its here, idont know what else to add, thankyou';
    this.wish.url = 'https://mikuexpo.com';
    this.wish.imgUrl = 'https://m.media-amazon.com/images/I/61KVfgeYlKL._AC_SL1200_.jpg';
    this.wish.dateCreation = new Date('2004-07-18T10:10:00Z');
    this.wish.tags = this.tagsExample;
  }


}

