import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from '../../../public/components/toolbar/toolbar.component';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {forkJoin} from 'rxjs';

/**
 * @Component LinkShareComponent
 * @description Displays a shareable link and handles navigation back to the share settings,
 * passing along content type, item ID, and a return URL.
 */
@Component({
  selector: 'app-share-link',
  templateUrl: './link-share.component.html',
  styleUrl: './link-share.component.css',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    ToolbarComponent,
    TranslatePipe,
    MatSnackBarModule
  ],
})
export class LinkShareComponent implements OnInit {
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
    private router: Router,
    private translate: TranslateService,
    private snackBar: MatSnackBar
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
   * @description Navigates back to the return URL provided in query parameters,
   * or a default URL if not specified.
   */
  goBack(): void {
    if (this.returnUrl) {
      console.log('LinkShareComponent: Navigating back to:', this.returnUrl);
      this.router.navigateByUrl(this.returnUrl);
    } else {
      console.warn('LinkShareComponent: returnUrl no encontrado, redirigiendo a /collections como fallback.');
      this.router.navigate(['/collections']);
    }
  }

  /**
   * @function copyLinkToClipboard
   * @description Copies the shareableLink to the clipboard and shows a confirmation message.
   */
  copyLinkToClipboard(): void {
    if (this.shareableLink) {
      forkJoin({
        copiedMessage: this.translate.get('linkShare.copiedToClipboard'),
        closeButtonText: this.translate.get('actions.close'),
        copyFailedMessage: this.translate.get('linkShare.copyFailed')
      }).subscribe(({ copiedMessage, closeButtonText, copyFailedMessage }) => {

        navigator.clipboard.writeText(this.shareableLink!).then(() => {
          this.snackBar.open(copiedMessage, closeButtonText, {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          });
        }).catch(err => {
          console.error('Error al copiar el texto: ', err);
          this.snackBar.open(copyFailedMessage, closeButtonText, {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
        });
      });
    }
  }
}
