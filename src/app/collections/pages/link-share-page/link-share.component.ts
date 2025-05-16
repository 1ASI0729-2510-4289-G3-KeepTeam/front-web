import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-share-link', // Updated selector
  templateUrl: './link-share.component.html',
  styleUrl: './link-share.component.css',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
})
export class LinkShareComponent implements OnInit { // Updated class name
  shareableLink: string | null = null;
  contentType: string | null = null; // Add contentType
  itemId: string | null = null;      // Add itemId
  returnUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.shareableLink = params['link'];
      this.contentType = params['contentType'];
      this.itemId = params['itemId'];
      this.returnUrl = params['returnUrl']; // <---- RECIBE returnUrl
      console.log('Link obtained:', this.shareableLink, 'contentType:', this.contentType, 'itemId:', this.itemId, 'returnUrl:', this.returnUrl);
    });
  }
  goBack(): void {
    this.router.navigate(['/share-settings'], {
      queryParams: {
        contentType: this.contentType,
        itemId: this.itemId,
        returnUrl: this.returnUrl // <---- PASA returnUrl DE VUELTA
      }
    });
  }


}
