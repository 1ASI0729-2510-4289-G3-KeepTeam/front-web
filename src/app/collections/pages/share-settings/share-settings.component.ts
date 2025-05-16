import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-share-settings',
  templateUrl: './share-settings.component.html',
  styleUrl: './share-settings.component.css',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    RouterLink,
    NgIf,
  ],
})
export class ShareSettingsComponent implements OnInit {
  contentType: string = 'collection'; // Default to collection
  itemId: string | null = null;
  previousUrl: string = '/collections'; // Default previous URL

  expiryEnabled: boolean = false;
  expiryDate: string | null = null;
  permission: 'view' | 'edit' = 'view';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      console.log('ShareSettingsComponent: ngOnInit() queryParams:', queryParams);
      this.contentType = queryParams['contentType'] || 'collection';
      this.itemId = queryParams['itemId'];
      this.previousUrl = queryParams['previousUrl'] || '/collections';
      console.log('ShareSettingsComponent: ngOnInit() contentType:', this.contentType, 'itemId:', this.itemId, 'previousUrl:', this.previousUrl);
    });
  }


  goBack(): void {
    this.route.queryParams.subscribe(queryParams => {
      const returnUrl = queryParams['returnUrl'];
      if (returnUrl) {
        console.log('ShareSettingsComponent: Navigating back to returnUrl:', returnUrl);
        this.router.navigateByUrl(returnUrl);
      } else {
        const navigationUrl = [this.previousUrl];
        console.log('ShareSettingsComponent: Navigating back to previousUrl:', navigationUrl);
        this.router.navigate(navigationUrl);
      }
    });
  }

  setPermission(permission: 'view' | 'edit'): void {
    this.permission = permission;
  }

  onDateInputChange(): void {
    console.log('Fecha digitada:', this.expiryDate);
  }

  validateDate(): void {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (this.expiryDate && !dateRegex.test(this.expiryDate)) {
      console.warn('Formato de fecha inválido');
    }
  }

  allowOnlyNumbersAndHyphen(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      (charCode >= 48 && charCode <= 57) || // Números 0-9
      charCode === 45 // Guion (-)
    ) {
      return true;
    }
    event.preventDefault();
    return false;
  }


  private generateShareableLink(): string {
    let baseUrl = 'www.keeplo.com/share/';
    if (this.contentType === 'wish' && this.itemId) {
      baseUrl += 'wish/';
      return baseUrl + this.itemId;
    } else if (this.contentType === 'collection' && this.itemId) {
      baseUrl += 'collection/';
      return baseUrl + this.itemId;
    } else if (this.contentType === 'collections-list') {
      baseUrl += 'collections/';
      return baseUrl;
    }
    return 'undefined';
  }

  getLink(): void {
    console.log('ShareSettingsComponent: getLink() called. contentType:', this.contentType, 'itemId:', this.itemId);
    if (this.itemId) {
      const link = this.generateShareableLink();
      console.log('ShareSettingsComponent: Generated link:', link);
      this.router.navigate(['/link-share'], {
        queryParams: {
          link: link,
          contentType: this.contentType,
          itemId: this.itemId,
          returnUrl: this.router.url
        }
      });
    } else {
      console.warn('ShareSettingsComponent: getLink() called but itemId is undefined.');
    }
  }
}
