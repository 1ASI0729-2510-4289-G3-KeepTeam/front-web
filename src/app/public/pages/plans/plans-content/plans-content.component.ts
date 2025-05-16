import { Component } from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-plans-content',
  imports: [
    MatCard,
    MatCardContent,
    MatButton,
    RouterLink
  ],
  templateUrl: './plans-content.component.html',
  styleUrl: './plans-content.component.css'
})
export class PlansContentComponent {
  constructor(private router: Router) {
  }


}
