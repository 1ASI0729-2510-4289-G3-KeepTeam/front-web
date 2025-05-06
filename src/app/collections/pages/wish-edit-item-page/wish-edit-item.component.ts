import { AfterViewInit,Component, ElementRef, signal, computed, model, ViewChild } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ItemActionsComponent} from '../../components/item-actions/item-actions.component';
import {Wish} from '../../model/wish.entity';
import {Tag} from '../../model/tag.entity';
import {DatePipe, NgForOf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-edit-wish-item',
  imports: [
    MatIconModule,
    ItemActionsComponent,
    DatePipe,
    MatButtonModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatAutocompleteModule,
    NgForOf,
  ],
  templateUrl: './wish-edit-item.component.html',
  styleUrl: './wish-edit-item.component.css'
})
export class WishEditItemComponent implements AfterViewInit {

  // Entities de prueba
  tagsExample: Tag[] = [];
  wish: Wish = new Wish();

  constructor() {
    const tag1 = new Tag();
    tag1.name = 'Plushies';
    tag1.color = '#FFC8DF';

    const tag2 = new Tag();
    tag2.name = 'Blue Pallete';
    tag2.color = '#C8FDFF';

    this.tagsExample.push(tag1, tag2);

    this.wish.id = '123laleleimAnID';
    this.wish.title = 'Miku Plushie';
    this.wish.description = 'A miku plushie, very affordable, very blue, i like blue things, thats the only reason its here, idont know what else to add, thankyou';
    this.wish.url = 'https://mikuexpo.com';
    this.wish.imgUrl = 'https://m.media-amazon.com/images/I/61KVfgeYlKL._AC_SL1200_.jpg';
    this.wish.dateCreation = new Date('2004-07-18T10:10:00Z');
    this.wish.tags = this.tagsExample;
  }

  allTags: Tag[] = [
    { name: 'Plushies', color: '#FFC8DF' },
    { name: 'Blue Pallete', color: '#C8FDFF' },
    { name: 'Brazil', color: '#CAFFC8' },
  ];

  //fin de entities de prueba

  protected readonly value = signal('');

  @ViewChild('input') input!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(): void {
    this.adjustHeight();
  }

  protected onInput(event: Event): void {
    const newValue = (event.target as HTMLTextAreaElement).value;
    this.value.set(newValue);
    this.adjustHeight();
  }

  private adjustHeight(): void {
    const el = this.input.nativeElement;
    el.style.height = '';
    el.style.height = el.scrollHeight + 'px';
  }



  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentTag = model('');
  readonly tags = signal(this.wish.tags);
  readonly filteredTags = computed(() => {
    const currentTag = this.currentTag().toLowerCase();
    return currentTag
      ? this.allTags.filter(tag => tag.name.toLowerCase().includes(currentTag))
      : this.allTags.slice();
  });

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {

      const colors = ['#FFC8DF', '#C8FDFF', '#CAFFC8'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      let tag = new Tag()
      tag.name = value
      tag.color = randomColor
      this.tags.update(tags => [...tags, tag]);
      if (!this.wish.tags.some(t => t.name === tag.name)) {
        this.wish.tags.push(tag);
      }
      if (!this.allTags.some(t => t.name === tag.name)) {
        this.allTags.push(tag);
      }
    }

    // Clear the input value
    this.currentTag.set('');
  }

  remove(tag: Tag): void {

    // allTags
    const index = this.allTags.indexOf(tag);
    if (index < 0) {
      console.log(`wish.tags: ${tag.name} not found`);
    } else {
      this.allTags.splice(index, 1);
      console.log(`wish.tags: Removed ${tag.name} from `);
      console.log(this.allTags);
    }

    // wish.tags
    const indexWish = this.wish.tags.indexOf(tag);
    if (indexWish < 0) {
      console.log(`wish.tags: ${tag.name} not found`);
    } else {
      this.wish.tags.splice(indexWish, 1);
      console.log(`wish.tags: Removed ${tag.name} from `);
      console.log(this.wish.tags);
    }
  }



  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.update(tags => [...tags]);
    this.currentTag.set('');
    event.option.deselect();
  }


}
