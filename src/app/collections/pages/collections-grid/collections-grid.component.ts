import { Component } from '@angular/core';

import {MatIconModule} from '@angular/material/icon';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {SearchBarComponent} from '../../components/search-bar/search-bar.component';
import {CreationButtonsComponent} from '../../components/creation-buttons/creation-buttons.component';

@Component({
  selector: 'app-collections-grid',
  imports: [
    MatIconModule,
    SidebarComponent,
    SearchBarComponent,
    CreationButtonsComponent
  ],
  templateUrl: './collections-grid.component.html',
  styleUrl: './collections-grid.component.css'
})
export class CollectionsGridComponent {

}
