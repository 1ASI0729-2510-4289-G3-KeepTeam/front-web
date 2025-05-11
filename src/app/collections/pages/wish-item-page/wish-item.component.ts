import {Component, OnInit} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ItemActionsComponent } from '../../components/item-actions/item-actions.component';
import { MatButtonModule } from '@angular/material/button';
import { TagListComponent } from '../../../public/components/tags/tag-list.component';
import {Wish} from '../../model/wish.entity';
import {ActivatedRoute} from '@angular/router';
import {CollectionsService} from '../../services/collections.service';

@Component({
  selector: 'app-wish-item',
  imports: [
    MatIconModule,
    ItemActionsComponent,
    MatButtonModule,
    TagListComponent,
  ],
  templateUrl: './wish-item.component.html',
  styleUrl: './wish-item.component.css',
})
export class WishItemComponent implements OnInit {
  wishId: string | null = null;  // Para almacenar el ID del producto
  wish: Wish | undefined = undefined;   // Aquí almacenamos la información del producto

  constructor(
    private route: ActivatedRoute,  // Para obtener parámetros de la URL
    private wishService: CollectionsService// Inyectamos tu servicio
  ) {}

  ngOnInit(): void {
    // Obtenemos el productId de la URL
    this.wishId = this.route.snapshot.paramMap.get('productId');

    // Si tenemos un productId, hacemos la solicitud
    if (this.wishId) {
      this.getWishDetails(this.wishId);
    }
  }

  // Llamamos al servicio para obtener la información del producto

  getWishDetails(id: string): void {
    this.wishService.getWishById(id).subscribe({
      next: (data) => {
        this.wish = {
          ...data,
          tags: data.tags || []  // Asegura que siempre sea un arreglo vacío si tags es undefined
        };
        console.log(this.wish);
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
      },
    });
  }
  goBack(): void {
    history.back();
  }}
