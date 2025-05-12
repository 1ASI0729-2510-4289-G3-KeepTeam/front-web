import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wish-share-settings',
  templateUrl: './wish-share-settings.component.html',
  styleUrl: './wish-share-settings.component.css',
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
  ],
})
export class WishShareSettingsComponent implements OnInit {
  expiryEnabled: boolean = false;
  expiryDate: string | null = null;
  permission: 'view' | 'edit' = 'view';
  wishId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.wishId = params['id'];
      console.log('Wish ID recibido:', this.wishId);
    });
  }

  goBack(): void {
    if (this.wishId) {
      this.router.navigate(['/wish', this.wishId]);
    } else {
      console.warn('Wish ID is not available. Navigating to a default page.');
      this.router.navigate(['/some-default-page']);
    }
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

  getLink(): void {
    const link = this.generateShareableLink();

    console.log('Generated link:', link);

    this.router.navigate(['/wish/link', this.wishId, { link: link }]);
  }

  private generateShareableLink(): string {
    const baseUrl = 'www.keeplo.com/share/wish/';
    return `${baseUrl}${this.wishId}`;
  }}
