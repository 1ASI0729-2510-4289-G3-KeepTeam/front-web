import { Component } from '@angular/core';

import {MatIconModule} from '@angular/material/icon';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {SearchBarComponent} from '../../components/search-bar/search-bar.component';
import {CreationButtonsComponent} from '../../components/creation-buttons/creation-buttons.component';

@Component({
  selector: 'app-collections-page',
  imports: [
    MatIconModule,
    SidebarComponent,
    SearchBarComponent,
    CreationButtonsComponent
  ],
  templateUrl: './collections-page.component.html',
  styleUrl: './collections-page.component.css'
})
export class CollectionsPageComponent {

}
