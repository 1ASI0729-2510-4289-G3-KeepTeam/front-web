import { Component } from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {ToolbarComponent} from '../../../components/toolbar/toolbar.component';
/**
 * Plans content component.
 * Displays available membership plans and allows navigation to the purchase flow.
 */
@Component({
  selector: 'app-plans-content',
  imports: [
    MatCard,
    MatCardContent,
    MatButton,
    RouterLink,
    TranslatePipe,
    ToolbarComponent
  ],
  templateUrl: './plans-content.component.html',
  styleUrl: './plans-content.component.css'
})
export class PlansContentComponent {
  /**
   * Creates an instance of the plans content component.
   *
   * @param router Used to navigate to the purchase page with query parameters.
   */
  constructor(private router: Router) {
  }
  /**
   * Navigates to the purchase page with the selected membership ID as a query parameter.
   *
   * @param membershipId The ID of the selected membership plan.
   */
  goToPurchase(membershipId: number): void {
    this.router.navigate(['/purchase'], { queryParams: { membershipId } });
  }


}
