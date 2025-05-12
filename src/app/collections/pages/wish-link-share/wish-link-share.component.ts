import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-wish-link-share',
  templateUrl: './wish-link-share.component.html',
  styleUrl: './wish-link-share.component.css',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
})
export class WishLinkShareComponent implements OnInit {
  shareableLink: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.shareableLink = params['link'];
      console.log('Enlace recibido:', this.shareableLink);
    });
  }

  goBack(): void {
    this.router.navigate(['/wish/share', this.route.snapshot.params['id']]);
  }
}
