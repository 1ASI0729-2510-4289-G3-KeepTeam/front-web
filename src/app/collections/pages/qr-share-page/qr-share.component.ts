import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as QRCode from 'qrcode';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { CollectionsService } from '../../services/collections.service'; // Importa el servicio
/**
 * @Component QrShareComponent
 * @description Generates and displays a QR code for a wish or collection item based on query parameters.
 *              Allows downloading the QR code and navigating back to the previous page.
 */
@Component({
  selector: 'app-qr-share',
  templateUrl: './qr-share.component.html',
  styleUrl: './qr-share.component.css',
  standalone: true,
  imports: [
    MatButton,
    MatIconModule,
    MatIconButton,
    NgIf,
  ]
})
export class QrShareComponent implements OnInit {
  /**
   * @property {string | null} contentType - Type of content to share ('wish' or 'collection').
   */
  contentType: string | null = null;

  /**
   * @property {string | null} itemId - ID of the wish or collection item to share.
   */
  itemId: string | null = null;

  /**
   * @property {string} qrCodeValue - The generated QR code as a data URL.
   */
  qrCodeValue: string = '';

  /**
   * @property {string} previousUrl - URL to navigate back to, defaults to '/collections'.
   */
  previousUrl: string = '/collections';

  /**
   * @property {any} wish - Wish data loaded from service (if contentType is 'wish').
   */
  wish: any;

  /**
   * @property {any} collection - Collection data loaded from service (if contentType is 'collection').
   */
  collection: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collectionsService: CollectionsService
  ) { }

  /**
   * @function ngOnInit
   * @description Subscribes to query parameters and loads the corresponding item details.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.contentType = params['contentType'];
      this.itemId = params['itemId'];
      this.previousUrl = params['previousUrl'] || '/collections';
      this.loadItemDetails();
    });
  }

  /**
   * @function loadItemDetails
   * @description Fetches wish or collection details from the service based on contentType and itemId.
   *              Calls QR code generation after data is loaded.
   */
  loadItemDetails(): void {
    if (this.contentType === 'wish' && this.itemId) {
      this.collectionsService.getWishById(this.itemId).subscribe(data => {
        this.wish = data;
        this.generateQrCode();
      });
    } else if (this.contentType === 'collection' && this.itemId) {
      this.collectionsService.getCollectionById(this.itemId).subscribe(data => {
        this.collection = data;
        this.generateQrCode();
      });
    }
  }

  /**
   * @function generateQrCode
   * @description Generates a QR code using the redirectUrl for wishes or a collection-specific URI.
   *              Sets the QR code image data URL to `qrCodeValue`.
   */
  generateQrCode(): void {
    let qrContent = '';
    if (this.contentType === 'wish' && this.wish?.redirectUrl) {
      qrContent = this.wish.redirectUrl;
    } else if (this.contentType === 'collection' && this.collection?.id) {
      qrContent = `keeplo-collection:${this.collection.id}`;
    }

    if (qrContent) {
      QRCode.toDataURL(qrContent, { errorCorrectionLevel: 'M' }, (err, url) => {
        if (err) {
          console.error('Error generating QR code:', err);
          return;
        }
        this.qrCodeValue = url;
      });
    }
  }

  /**
   * @function downloadQrCode
   * @description Triggers download of the generated QR code as a PNG image file.
   *              Alerts if no QR code has been generated yet.
   */
  downloadQrCode(): void {
    if (this.qrCodeValue) {
      const link = document.createElement('a');
      link.href = this.qrCodeValue;
      link.download = `keeplo-${this.contentType}-${this.itemId}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No QR code generated yet.');
    }
  }

  /**
   * @function goBack
   * @description Navigates back to the previous URL stored in `previousUrl`.
   */
  goBack(): void {
    this.router.navigateByUrl(this.previousUrl);
  }
}
