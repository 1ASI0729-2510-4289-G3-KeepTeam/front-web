import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {NgIf} from '@angular/common';

/**
 * @Component ShareSettingsComponent
 * @description Component for configuring share settings of wishes or collections.
 *              Allows setting permissions, expiry dates, and generating shareable links.
 */

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
    NgIf,
  ],
})
export class ShareSettingsComponent implements OnInit {
  /**
   * @property {string} contentType - Type of content to share ('wish', 'collection', or 'collections-list').
   *                                  Defaults to 'collection'.
   */
  contentType: string = 'collection';

  /**
   * @property {string | null} itemId - ID of the wish or collection item to share.
   */
  itemId: string | null = null;

  /**
   * @property {string} previousUrl - URL to navigate back to, defaults to '/collections'.
   */
  previousUrl: string = '/collections';

  /**
   * @property {boolean} expiryEnabled - Flag to enable or disable expiry date for the share link.
   */
  expiryEnabled: boolean = false;

  /**
   * @property {string | null} expiryDate - Expiry date string in 'YYYY-MM-DD' format.
   */
  expiryDate: string | null = null;

  /**
   * @property {'view' | 'edit'} permission - Permission level for the shared item.
   */
  permission: 'view' | 'edit' = 'view';

  constructor(private router: Router, private route: ActivatedRoute) {}

  /**
   * @function ngOnInit
   * @description Subscribes to query parameters and initializes component state accordingly.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      console.log('ShareSettingsComponent: ngOnInit() queryParams:', queryParams);
      this.contentType = queryParams['contentType'] || 'collection';
      this.itemId = queryParams['itemId'];
      this.previousUrl = queryParams['previousUrl'] || '/collections';
      console.log('ShareSettingsComponent: ngOnInit() contentType:', this.contentType, 'itemId:', this.itemId, 'previousUrl:', this.previousUrl);
    });
  }

  /**
   * @function goBack
   * @description Navigates back to the return URL if specified in query parameters,
   *              otherwise navigates to the previousUrl property.
   */
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

  /**
   * @function setPermission
   * @param {'view' | 'edit'} permission - Permission level to set.
   * @description Updates the permission property to the specified value.
   */
  setPermission(permission: 'view' | 'edit'): void {
    this.permission = permission;
  }

  /**
   * @function onDateInputChange
   * @description Logs the currently typed expiry date (called on input change).
   */
  onDateInputChange(): void {
    console.log('Fecha digitada:', this.expiryDate);
  }

  /**
   * @function validateDate
   * @description Validates the expiryDate format as 'YYYY-MM-DD' and logs a warning if invalid.
   */
  validateDate(): void {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (this.expiryDate && !dateRegex.test(this.expiryDate)) {
      console.warn('Formato de fecha inválido');
    }
  }

  /**
   * @function allowOnlyNumbersAndHyphen
   * @param {KeyboardEvent} event - The keyboard event to handle.
   * @returns {boolean} True if the pressed key is a number (0-9) or hyphen (-), false otherwise.
   * @description Prevents input of characters other than digits and hyphen.
   */
  allowOnlyNumbersAndHyphen(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      (charCode >= 48 && charCode <= 57) || // Numbers 0-9
      charCode === 45 // Hyphen (-)
    ) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  /**
   * @function generateShareableLink
   * @returns {string} A generated shareable URL string based on contentType and itemId.
   * @description Creates the share URL for wishes, collections, or collections-list.
   */
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

  /**
   * @function getLink
   * @description Generates the shareable link and navigates to the link-share component with query params.
   *              Logs warnings if itemId is undefined.
   */
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
