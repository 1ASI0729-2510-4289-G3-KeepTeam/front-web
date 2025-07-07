// src/app/components/collection-pdf-template/collection-pdf-template.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FullCollection} from '../../../collections/model/fullCollection.entity';
import { Wish} from '../../../collections/model/wish.entity';
import { TranslateModule } from '@ngx-translate/core';
import { Collection } from '../../../collections/model/collection.entity';
/**
 * Interface representing the data of a subcollection for PDF export.
 */
export interface SubcollectionPdfData {
  /**
   * Metadata and basic information about the subcollection.
   */
  collectionInfo: Collection;
  /**
   * List of wishes/items belonging to the subcollection.
   */
  items: Wish[];
}
/**
 * Component used as a template to render a collection and its subcollections for PDF generation.
 */
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
  /**
   * The main collection with its metadata and aggregated information.
   */
  @Input() collection: FullCollection | undefined;

  /**
   * The list of wishes/items directly under the main collection.
   */
  @Input() items: Wish[] | undefined;
  /**
   * The list of subcollections and their associated items, used for rendering grouped data.
   */
  @Input() subcollectionsData: SubcollectionPdfData[] | undefined;
  /**
   * Title of the parent collection (if the current collection is a subcollection).
   */
  // ¡NUEVO INPUT PARA EL TÍTULO DE LA COLECCIÓN PADRE!
  @Input() parentCollectionTitle: string | undefined;
}
