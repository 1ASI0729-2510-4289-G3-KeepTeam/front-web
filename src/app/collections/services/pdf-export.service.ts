import { Injectable, Renderer2, RendererFactory2, ComponentFactoryResolver, Injector, ApplicationRef } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CollectionsService } from './collections.service';
import { FullCollection } from '../model/fullCollection.entity';
import { Wish } from '../model/wish.entity';
import { TranslateService } from '@ngx-translate/core';
import { CollectionPdfTemplateComponent, SubcollectionPdfData } from '../../public/components/collection-pdf-template/collection-pdf-template.component';
import {forkJoin, map, switchMap, of, catchError, Observable} from 'rxjs';

/**
 * @class PdfExportService
 * @description
 * Service responsible for exporting collection data into a PDF document.
 * It dynamically creates an Angular component, renders it to an HTML element,
 * converts the HTML to a canvas image using html2canvas, and then generates
 * a multi-page PDF using jsPDF.
 */
@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  /**
   * @property renderer
   * @description Angular Renderer2 instance used for DOM manipulation, particularly for attaching/detaching components for PDF generation.
   * @private
   */
  private renderer: Renderer2;

  /**
   * @constructor
   * @param collectionsService - Service for fetching collection and wish data.
   * @param translate - Service for internationalization (though not directly used for text in this service, it's typically for UI).
   * @param componentFactoryResolver - Resolves component factories for dynamic component creation.
   * @param injector - The injector for creating component instances.
   * @param appRef - The application reference for attaching views.
   * @param rendererFactory - Factory to create a Renderer2 instance.
   */
  constructor(
    private collectionsService: CollectionsService,
    private translate: TranslateService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * @function exportCollectionToPdf
   * @description
   * Initiates the PDF export process for a given collection.
   * It fetches all necessary data (parent collection title, main collection's items,
   * and all sub-collections' items) concurrently. Once all data is retrieved,
   * it calls `generatePdfFromHtml` to create the PDF.
   * @param collection - The FullCollection object to be exported.
   */
  exportCollectionToPdf(collection: FullCollection): void {
    console.log('1. exportCollectionToPdf called for collection:', collection);
    if (!collection || !collection.id) {
      console.error('No collection provided for PDF export.');
      return;
    }

    let parentCollectionTitle$: Observable<string | undefined> = of(undefined);
    if (collection.idParentCollection !== 0) {
      console.log('2. Collection has a parent. Fetching parent with ID:', collection.idParentCollection);
      parentCollectionTitle$ = this.collectionsService.getCollectionById(collection.idParentCollection).pipe(
        map(parentCol => {
          console.log('2a. Parent collection fetched successfully (title):', parentCol.title);
          return parentCol.title;
        }),
        catchError(err => {
          console.error('2b. Error fetching parent collection title:', err);
          return of(undefined);
        })
      );
    } else {
      console.log('2. Collection is a top-level collection (no parent).');
    }

    /** Observable to get items of the main collection being exported */
    const mainItems$: Observable<Wish[]> = this.collectionsService.getProductsByIdCollection(collection.id).pipe(
      map((mainItems: Wish[]) => {
        console.log('3a. Raw main items fetched for current collection (before filter):', mainItems);
        return mainItems.filter(item => !item.isInTrash);
      }),
      catchError(err => {
        console.error('3b. Error fetching main items for collection ID', collection.id, ':', err);
        return of([]);
      })
    );

    /** Observable to get data for sub-subcollections (if any) */
    const subcollectionsData$: Observable<SubcollectionPdfData[]> = this.collectionsService.getSubCollectionsFromCollection(collection.id).pipe(
      switchMap((subCollections: FullCollection[]) => {
        console.log('4a. Raw sub-subcollections fetched for current collection (before filter):', subCollections);
        const activeSubCollections = subCollections.filter(subCol => !subCol.isInTrash);

        if (activeSubCollections.length === 0) {
          console.log('4b. No active sub-subcollections found for PDF export under collection ID', collection.id);
          return of([]);
        }

        console.log('4c. Active sub-subcollections found, mapping to item fetch requests:', activeSubCollections);
        const subCollectionItemRequests = activeSubCollections.map(subCol =>
          this.collectionsService.getProductsByIdCollection(subCol.id).pipe(
            map((subItems: Wish[]) => {
              console.log('4d. Raw items fetched for sub-subcollection "', subCol.title, '":', subItems);
              return subItems.filter(item => !item.isInTrash);
            }),
            map((filteredSubItems: Wish[]) => ({
              collectionInfo: subCol,
              items: filteredSubItems
            } as SubcollectionPdfData)),
            catchError(err => {
              console.error('4e. Error fetching items for sub-subcollection "', subCol.title, '":', err);
              return of({ collectionInfo: subCol, items: [] } as SubcollectionPdfData);
            })
          )
        );
        /** forkJoin to wait for all sub-subcollection items to be fetched */
        return forkJoin(subCollectionItemRequests).pipe(
          catchError(err => {
            console.error('4f. Error in forkJoin for sub-subcollection item requests:', err);
            return of([]);
          })
        );
      }),
      catchError(err => {
        console.error('4g. Error fetching subcollections themselves (initial call):', err);
        return of([]);
      })
    );

    /** Combine all Observables into a single forkJoin */
    console.log('5. Setting up final forkJoin subscription...');
    forkJoin([
      parentCollectionTitle$,
      mainItems$,
      subcollectionsData$
    ]).subscribe({
      next: ([parentTitle, mainItems, subcollectionsData]) => {
        console.log('6. All data fetched (forkJoin next block). Parent title:', parentTitle, 'Main items count:', mainItems.length, 'Subcollections data count:', subcollectionsData.length);
        this.generatePdfFromHtml(collection, mainItems, subcollectionsData, parentTitle);
      },
      error: (error) => {
        console.error('6.1. Error in PDF export subscription (main forkJoin error block):', error);
        /** If there's an error in any call, attempt to generate PDF with available data or empty */
        this.generatePdfFromHtml(collection, [], [], undefined);
      }
    });
  }

  /**
   * @function generatePdfFromHtml
   * @description
   * Dynamically creates an instance of `CollectionPdfTemplateComponent`,
   * populates it with the provided collection data, attaches it to the DOM
   * off-screen, captures its content as an image using html2canvas, and then
   * uses jsPDF to create a multi-page PDF document.
   * @private
   * @param collection - The main FullCollection object for the PDF.
   * @param items - An array of Wish items belonging to the main collection.
   * @param subcollectionsData - An array of SubcollectionPdfData containing sub-collection info and their items.
   * @param parentCollectionTitle - The title of the parent collection, if applicable.
   * @returns {Promise<void>} A promise that resolves when the PDF is generated and saved.
   */
  private async generatePdfFromHtml(
    collection: FullCollection,
    items: Wish[],
    subcollectionsData: SubcollectionPdfData[],
    parentCollectionTitle: string | undefined
  ): Promise<void> {
    console.log('7. generatePdfFromHtml called for:', collection.title);
    console.log('   - Items count (passed):', items.length);
    console.log('   - Subcollections data count (passed):', subcollectionsData.length);
    console.log('   - Parent Collection Title (passed):', parentCollectionTitle);

    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(CollectionPdfTemplateComponent)
      .create(this.injector);

    componentRef.instance.collection = collection;
    componentRef.instance.items = items;
    componentRef.instance.subcollectionsData = subcollectionsData;
    componentRef.instance.parentCollectionTitle = parentCollectionTitle;

    this.appRef.attachView(componentRef.hostView);

    const elementToCapture = componentRef.location.nativeElement;

    /** Ensure the element is attached and visible to html2canvas outside the viewport */
    const divContainer = this.renderer.createElement('div');
    this.renderer.appendChild(document.body, divContainer);
    this.renderer.appendChild(divContainer, elementToCapture);

    this.renderer.setStyle(divContainer, 'position', 'absolute');
    this.renderer.setStyle(divContainer, 'left', '-9999px');
    this.renderer.setStyle(divContainer, 'top', '-9999px');
    this.renderer.setStyle(divContainer, 'width', '210mm'); /** A4 width */
    this.renderer.setStyle(divContainer, 'min-height', '297mm'); /** A4 minimum height */
    this.renderer.setStyle(divContainer, 'overflow', 'hidden');

    await componentRef.changeDetectorRef.detectChanges();
    console.log('8. Component change detection run. Waiting for render...');
    /** A small delay to ensure the DOM settles and images are loaded */
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (!elementToCapture) {
        console.error('9. Element to capture is null or undefined after attach.');
        throw new Error('DOM element to capture is null.');
      }
      console.log('9. Attempting to capture HTML element with html2canvas. Element:', elementToCapture);

      const canvas = await html2canvas(elementToCapture, {
        scale: 2, /** Higher scale for better quality */
        useCORS: true, /** Important if images are from different domains */
        allowTaint: true, /** Needed for cross-origin images without proper CORS */
        logging: true, /** Enable html2canvas logs in the console */
        windowWidth: elementToCapture.scrollWidth,
        windowHeight: elementToCapture.scrollHeight,
        x: elementToCapture.offsetLeft,
        y: elementToCapture.offsetTop
      } as any);

      const imgData = canvas.toDataURL('image/jpeg', 0.9); /** Quality 0.9 */

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 200; /** Image width in PDF (210mm - 5mm margin on each side) */
      const pageHeight = pdf.internal.pageSize.height; /** Height of an A4 page in mm */
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0; /** Initial vertical position on the page */

      pdf.addImage(imgData, 'JPEG', 5, position, imgWidth, imgHeight); /** Add the first image */

      heightLeft -= pageHeight;
      while (heightLeft >= -1) { /** Iterate to add pages if content is longer than one page */
      position = heightLeft - imgHeight; /** Calculate the vertical position for the next page */
      pdf.addPage(); /** Add new page */
      pdf.addImage(imgData, 'JPEG', 5, position, imgWidth, imgHeight); /** Add the same image with the new position */
      heightLeft -= pageHeight;
      }

      const fileName = `${collection.title.replace(/\s/g, '_')}.pdf`;
      console.log('10. PDF generated successfully. Saving as:', fileName);
      pdf.save(fileName);

    } catch (error) {
      console.error('8. Error during html2canvas or jsPDF processing:', error);
      alert('There was an error generating the PDF. Please check the console for more details.');
    } finally {
      console.log('11. Cleaning up component and DOM element.');
      if (componentRef) {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
      }
      if (divContainer) {
        this.renderer.removeChild(document.body, divContainer);
      }
    }
  }
}
