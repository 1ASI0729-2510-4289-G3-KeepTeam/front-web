import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as QRCode from 'qrcode';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { CollectionsService } from '../../services/collections.service'; // Importa el servicio

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
  contentType: string | null = null;
  itemId: string | null = null;
  qrCodeValue: string = '';
  previousUrl: string = '/collections';

  wish: any;
  collection: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collectionsService: CollectionsService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.contentType = params['contentType'];
      this.itemId = params['itemId'];
      this.previousUrl = params['previousUrl'] || '/collections';
      this.loadItemDetails();
    });
  }

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

  generateQrCode(): void {
    let qrContent = '';
    if (this.contentType === 'wish' && this.wish?.redirectUrl) { // Usa redirectUrl si existe
      qrContent = this.wish.redirectUrl;
    } else if (this.contentType === 'collection' && this.collection?.id) {
      qrContent = `keeplo-collection:${this.collection.id}`; // O la URL de la colección si la tienes
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

  goBack(): void {
    this.router.navigateByUrl(this.previousUrl);
  }
}
