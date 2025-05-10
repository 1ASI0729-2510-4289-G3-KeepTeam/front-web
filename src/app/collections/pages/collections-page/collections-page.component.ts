import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { CreationButtonsComponent } from '../../components/creation-buttons/creation-buttons.component';
import { CardComponent } from '../../cards/card/card.component';
import { CommonModule } from '@angular/common';
import { CardService } from '../../services/card.service';
import {CardAssembler} from '../../services/card-assembler';
import { CardEntity } from '../../model/card.entity';
import { CardResponse} from '../../services/card-response';

@Component({
  selector: 'app-collections-page',
  standalone: true,
  imports: [
    MatIconModule,
    SidebarComponent,
    SearchBarComponent,
    CreationButtonsComponent,
    CardComponent,
    CommonModule
  ],
  templateUrl: './collections-page.component.html',
  styleUrl: './collections-page.component.css',
})
export class CollectionsPageComponent implements OnInit {
  cards: CardResponse[] = [];

  constructor(
    private cardService: CardService) {}

  ngOnInit(): void {
    this.cardService.getCards().subscribe((data: CardResponse[]) => {
      this.cards = data;
    });
  }
}
