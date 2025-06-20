import { Component } from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-plans-content',
  imports: [
    MatCard,
    MatCardContent,
    MatButton,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './plans-content.component.html',
  styleUrl: './plans-content.component.css'
})
export class PlansContentComponent {
  constructor(private router: Router) {
  }


}
