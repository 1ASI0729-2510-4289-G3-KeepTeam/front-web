import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
/**
 * @component SearchBarComponent
 * @description
 * Component representing a basic search bar UI.
 */
@Component({
  selector: 'app-search-bar',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

}
