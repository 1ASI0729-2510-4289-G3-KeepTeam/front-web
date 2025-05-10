import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CardEntity } from '../model/card.entity';
import { CardAssembler } from './card-assembler';
import { CardResponse} from './card-response';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private readonly baseUrl = environment.fakeAPIBaseUrl;
  private readonly endpoint = environment.usersEndpointPath;
  private cardAssembler: CardAssembler;

  constructor(private http: HttpClient) {
    this.cardAssembler = new CardAssembler();
  }

  getCards(): Observable<CardResponse[]> {
    return this.http.get<CardEntity[]>(`${this.baseUrl}${this.endpoint}`).pipe(
      map((cards) =>
        cards.map((card) => this.cardAssembler.toResponse(card))
      )
    );
  }
}
