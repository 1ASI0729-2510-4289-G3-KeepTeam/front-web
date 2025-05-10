export interface CardResponse {
  id: string;
  name: string;
  visibility: string;
  items: CardItemResponse[];
}

export interface CardItemResponse {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: CardTagResponse[];
}

export interface CardTagResponse {
  name: string;
  color: string;
}
