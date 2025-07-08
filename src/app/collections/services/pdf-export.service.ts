import { Injectable, Renderer2, RendererFactory2, ComponentFactoryResolver, Injector, ApplicationRef } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CollectionsService } from './collections.service';
import { FullCollection } from '../model/fullCollection.entity';
import { Wish } from '../model/wish.entity';
import { TranslateService } from '@ngx-translate/core';
import { CollectionPdfTemplateComponent, SubcollectionPdfData } from '../../public/components/collection-pdf-template/collection-pdf-template.component';
import {forkJoin, map, switchMap, of, catchError, Observable, tap, timeout} from 'rxjs';
import { delay } from 'rxjs/operators';

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
  private renderer: Renderer2;

  constructor(
    private collectionsService: CollectionsService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  exportCollectionToPdf(collection: FullCollection): void {
    console.log('📦 Iniciando exportación para colección:', collection);

    if (!collection || !collection.id) {
      console.error('⛔ Colección inválida.');
      return;
    }

    // 1. Obtener el título del padre si existe
    const parentTitle$: Observable<string | undefined> =
      collection.idParentCollection !== 0
        ? this.collectionsService
          .getCollectionById(collection.idParentCollection)
          .pipe(
            timeout(15000),
            map(parent => parent.title),
            catchError(err => {
              console.error('⚠️ Error obteniendo colección padre:', err);
              return of(undefined);
            })
          )
        : of(undefined);

    // 2. Obtener los productos principales
    const items$: Observable<Wish[]> = this.collectionsService
      .getProductsByIdCollection(collection.id)
      .pipe(
        timeout(15000),
        map(items => {
          console.log('✅ Productos principales obtenidos:', items);
          return items.filter(i => !i.isInTrash);
        }),
        catchError(err => {
          console.error('🛑 Error obteniendo productos:', err);
          return of([]);
        })
      );

    // 3. Esperar ambos
    console.log('🧵 3. Combinando título del padre y productos...');
    forkJoin([parentTitle$, items$]).subscribe({
      next: ([parentTitle, items]) => {
        console.log('✅ Datos combinados listos:', { parentTitle, items });
        this.generatePdfFromHtml(collection, items, parentTitle);
      },
      error: err => {
        console.error('❌ Error combinando datos:', err);
        this.generatePdfFromHtml(collection, [], undefined);
      }
    });
  }

  private async generatePdfFromHtml(
    collection: FullCollection,
    items: Wish[],
    parentCollectionTitle: string | undefined
  ): Promise<void> {
    console.log('📄 Generando PDF para:', collection.title);

    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(CollectionPdfTemplateComponent)
      .create(this.injector);

    componentRef.instance.collection = collection;
    componentRef.instance.items = items;
    componentRef.instance.parentCollectionTitle = parentCollectionTitle;

    this.appRef.attachView(componentRef.hostView);

    const element = componentRef.location.nativeElement;
    const container = this.renderer.createElement('div');
    this.renderer.appendChild(document.body, container);
    this.renderer.appendChild(container, element);
    this.renderer.setStyle(container, 'position', 'absolute');
    this.renderer.setStyle(container, 'left', '-9999px');
    this.renderer.setStyle(container, 'top', '-9999px');
    this.renderer.setStyle(container, 'width', '210mm');
    this.renderer.setStyle(container, 'min-height', '297mm');

    await componentRef.changeDetectorRef.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      } as any);
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 200;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 5, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= -1) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 5, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${collection.title.replace(/\s/g, '_')}.pdf`;
      pdf.save(fileName);
      console.log('✅ PDF generado:', fileName);
    } catch (error) {
      console.error('🛑 Error generando el PDF:', error);
    } finally {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
      this.renderer.removeChild(document.body, container);
    }
  }
}
