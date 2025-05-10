import { Injectable } from '@angular/core';
import { CardEntity } from '../model/card.entity';
import { CardResponse } from './card-response';

@Injectable({ providedIn: 'root' })
export class CardAssembler {
  toResponse(card: CardEntity): CardResponse {

    const visibility = card.visibility || { view: false, edit: false }; // Default values in case visibility is undefined

    return {
      id: card.id,
      name: card.name,
      visibility: `${visibility.view ? 'view' : ''}${visibility.edit ? ' edit' : ''}`.trim(),
      items: (card.items ?? []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        url: item.url,
        tags: item.tags.map(tag => ({
          name: tag.name,
          color: tag.color
        }))
      }))
    };
  }
}
