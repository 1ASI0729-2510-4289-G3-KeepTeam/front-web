import { Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatLabel} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserService } from '../../services/user.service';
import {User} from '../../model/user';
import {Router} from '@angular/router';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
import {TokenStorageService} from '../../../shared/services/tokenStorage.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
/**
 * Component that allows users to add or update their payment card information.
 * It uses a reactive form and interacts with the UserService to persist changes.
 */
@Component({
  selector: 'app-user-edit-card',
  imports: [
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    ToolbarComponent,
    TranslatePipe
  ],
  templateUrl: './user-edit-card.component.html',
  styleUrl: './user-edit-card.component.css'
})
export class UserEditCardComponent implements OnInit {
  paymentForm!: FormGroup;
  user: User = new User();
  constructor(private fb: FormBuilder, private location: Location,
              private userService: UserService,
              private router: Router, private tokenStorageService: TokenStorageService,
              private snackBar: MatSnackBar,
              private translate: TranslateService) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      holderName: ['', Validators.required],
      expirationDate: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]]
    });
  }

  /**
   * On component initialization, retrieves the user data and pre-fills
   * the form if a payment card is already associated with the user.
   */

  ngOnInit(): void {
    const userId = this.tokenStorageService.getUserId();
    if (userId) {
      this.userService.getUserById(userId).subscribe(user => {
        this.user = user;

        // Llamada adicional para obtener la tarjeta
        this.userService.getCardsByUserId(userId).subscribe(cards => {
          if (cards.length > 0) {
            this.user.card = cards[0]; // Asignamos la tarjeta al usuario
          }

          this.paymentForm = this.fb.group({
            cardNumber: [this.user.card?.cardNumber || '', [
              Validators.required,
              Validators.pattern(/^\d{16}$/)
            ]],
            holderName: [this.user.card?.holderName || '', Validators.required],
            expirationDate: [this.user.card?.expirationDate || '', Validators.required],
            cvv: [this.user.card?.cvv || '', [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(4)
            ]]
          });
        });
      });
    } else {
      this.router.navigate(['/login']);
    }

  }
  /**
   * Submits the form to create or update the user's payment card.
   * If the card exists, it sends an update request.
   * Otherwise, it creates a new card associated with the user.
   */
  changeCard(): void {
    if (this.paymentForm.valid) {
      const cardData = this.paymentForm.value;

      if (this.user.card?.id) {
        this.userService.updateUserCard(this.user.card.id, cardData).subscribe({
          next: () => {
            this.showSuccess('cardUpdateSuccess');
          },
          error: () => {
            this.showError('cardUpdateError');
          }
        });
      } else {
        // Crear nueva tarjeta
        const newCard = { ...cardData, userId: this.user.id };
        this.userService.createUserCard(newCard).subscribe({
          next: () => {
            this.showSuccess('cardCreateSuccess');
            this.router.navigate(['/user-profile']);
          },
          error: () => {
            this.showError('cardCreateError');
          }
        });
      }

    } else {
      this.paymentForm.markAllAsTouched();
    }
  }
  /**
   * Navigates back to the previous page.
   */
  goBack(): void {
    this.location.back();
  }
  /**
   * Shows a translated snackbar error message.
   *
   * @param key Translation key for the error message.
   */
  private showError(key: string): void {

    this.snackBar.open(

      this.translate.instant(key),
      this.translate.instant('buttons.close'),
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error-login']
      }
    );
  }

  private showSuccess(key: string): void {
    this.snackBar.open(
      this.translate.instant(key),
      this.translate.instant('buttons.close'),
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-success']
      }
    );
  }
}
