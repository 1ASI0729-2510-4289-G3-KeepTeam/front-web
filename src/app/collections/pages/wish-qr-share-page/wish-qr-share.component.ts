import { Component, Input, OnInit } from '@angular/core';
import { Wish } from '../../model/wish.entity';
import { ActivatedRoute, Router } from '@angular/router';
import * as QRCode from 'qrcode';
import {MatButton, MatIconButton} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-wish-qr-share',
  templateUrl: './wish-qr-share.component.html',
  styleUrl: './wish-qr-share.component.css',
  standalone: true,
  imports: [
    MatButton,
    MatIconModule,
    MatIconButton,
    NgIf,
  ]
})
export class WishQrShareComponent implements OnInit {

  @Input() wish: Wish | undefined;
  qrCodeValue: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const wishId = params['id'];
      if (wishId) {
        this.getWishDetails(wishId);
      }
    });
  }

  getWishDetails(id: string): void {
    this.wish = {
      id: id,
      title: `Item with ID: ${id}`,
      description: 'Descripción del item...',
      url: 'https://example.com',
      imgUrl: 'https://via.placeholder.com/150',
      dateCreation: new Date(),
      tags: []
    };
    this.generateQrCode();
  }

  generateQrCode(): void {
    if (this.wish) {
      const qrContent = `ID: ${this.wish.id}\nTitle: ${this.wish.title}\nDescription: ${this.wish.description}\nURL: ${this.wish.url}`;
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
      link.download = `wish-${this.wish?.id}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No QR code generated yet.');
    }
  }

  goBack(): void {
    this.router.navigate(['/wish', this.route.snapshot.params['id']]);
  }
}
