import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { CreationButtonsComponent } from '../../components/creation-buttons/creation-buttons.component';
// import { CardComponent } from '../../cards/card/card.component';
import { ProductItemCardComponent } from '../../components/product-item-card/product-item-card.component';
import { CommonModule } from '@angular/common';
import { CardService } from '../../services/card.service';
// import {CardAssembler} from '../../services/card-assembler';
// import { CardEntity } from '../../model/card.entity';
import { CardResponse } from '../../services/card-response';
import { CollectionsService } from '../../services/collections.service';

@Component({
  selector: 'app-collections-page',
  standalone: true,
  imports: [
    MatIconModule,
    SidebarComponent,
    SearchBarComponent,
    CreationButtonsComponent,
    // CardComponent,
    ProductItemCardComponent,
    CommonModule,
  ],
  templateUrl: './collections-page.component.html',
  styleUrl: './collections-page.component.css',
})
export class CollectionsPageComponent implements OnInit {
  cards: CardResponse[] = [];

  constructor(private collectionService: CollectionsService) {}
  productItem: CardResponse | null = null;

  ngOnInit(): void {
    this.collectionService.getCollections().subscribe((data: any) => {
      console.log('Collections data:', data);
      this.productItem = {
        id: data[0].id,
        name: data[0].name,
        items: data[0].items,
        visibility: data[0].visibility,
      };

      // this.productItem = data[0].items[0];
    });
    // this.cardService.getCards().subscribe((data: CardResponse[]) => {
    //   this.cards = data;
    // });
  }
}
