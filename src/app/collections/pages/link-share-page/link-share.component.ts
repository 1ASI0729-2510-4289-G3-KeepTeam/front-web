import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
/**
 * @Component LinkShareComponent
 * @description Displays a shareable link and handles navigation back to the share settings,
 *              passing along content type, item ID, and a return URL.
 */
@Component({
  selector: 'app-share-link', // Updated selector
  templateUrl: './link-share.component.html',
  styleUrl: './link-share.component.css',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
})
export class LinkShareComponent implements OnInit { // Updated class name
  /**
   * @property {string | null} shareableLink - The URL that can be shared.
   */
  shareableLink: string | null = null;

  /**
   * @property {string | null} contentType - The type of content being shared.
   */
  contentType: string | null = null;

  /**
   * @property {string | null} itemId - The ID of the item being shared.
   */
  itemId: string | null = null;

  /**
   * @property {string | null} returnUrl - URL to return to after sharing.
   */
  returnUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * @function ngOnInit
   * @description Subscribes to query parameters from the route and assigns them to the component properties.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.shareableLink = params['link'];
      this.contentType = params['contentType'];
      this.itemId = params['itemId'];
      this.returnUrl = params['returnUrl'];
      console.log('Link obtained:', this.shareableLink, 'contentType:', this.contentType, 'itemId:', this.itemId, 'returnUrl:', this.returnUrl);
    });
  }

  /**
   * @function goBack
   * @description Navigates back to the share-settings page, passing along the content type, item ID, and return URL.
   */
  goBack(): void {
    this.router.navigate(['/share-settings'], {
      queryParams: {
        contentType: this.contentType,
        itemId: this.itemId,
        returnUrl: this.returnUrl
      }
    });
  }
}
