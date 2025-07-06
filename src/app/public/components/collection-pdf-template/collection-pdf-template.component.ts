// src/app/components/collection-pdf-template/collection-pdf-template.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FullCollection} from '../../../collections/model/fullCollection.entity';
import { Wish} from '../../../collections/model/wish.entity';
import { TranslateModule } from '@ngx-translate/core';
import { Collection } from '../../../collections/model/collection.entity';

export interface SubcollectionPdfData {
  collectionInfo: Collection;
  items: Wish[];
}

@Component({
  selector: 'app-collection-pdf-template',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    NgIf,
    TranslateModule
  ],
  templateUrl: './collection-pdf-template.component.html',
  styleUrls: ['./collection-pdf-template.component.css'],
})
export class CollectionPdfTemplateComponent {
  @Input() collection: FullCollection | undefined;
  @Input() items: Wish[] | undefined;
  @Input() subcollectionsData: SubcollectionPdfData[] | undefined;

  // ¡NUEVO INPUT PARA EL TÍTULO DE LA COLECCIÓN PADRE!
  @Input() parentCollectionTitle: string | undefined;
}
