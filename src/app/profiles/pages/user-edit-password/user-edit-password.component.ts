import { Component, OnInit  } from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatLabel} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {UserService} from '../../services/user.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {User} from '../../model/user';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';
import { Location } from '@angular/common';
import {MatError} from '@angular/material/input';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-user-edit-password',
  imports: [
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    NgIf,
    MatIcon,
    MatIconButton,
    MatError,
    ToolbarComponent,
    TranslatePipe
  ],
  templateUrl: './user-edit-password.component.html',
  styleUrl: './user-edit-password.component.css'
})
export class UserEditPasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  user: User = new User();

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private userService: UserService,
    private router: Router,
  private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
       return;
    }

    this.userService.getUserById(userId).subscribe(user => {
      this.user = user;

      this.passwordForm = this.fb.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['', Validators.required]
      }, { validators: this.passwordMatchValidator });
    });
  }

  get currentPassword() {
    return this.passwordForm.get('currentPassword');
  }

  get newPassword() {
    return this.passwordForm.get('newPassword');
  }

  get repeatPassword() {
    return this.passwordForm.get('repeatPassword');
  }

  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;
    return newPassword === repeatPassword ? null : { passwordMismatch: true };
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.userService.changePassword(this.user.id, currentPassword, newPassword).subscribe({
        next: () => {
          this.translate.get('passwordEdit.passwordChangedSuccess').subscribe((res: string) => {
            alert(res);
          });
        },
        error: () => {
          this.translate.get('passwordEdit.passwordChangedError').subscribe((res: string) => {
            alert(res);
          });
        }
      });
      this.passwordForm.reset();
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

  goBack(): void {
    this.location.back();
  }
}

