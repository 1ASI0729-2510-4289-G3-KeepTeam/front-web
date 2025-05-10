export interface CardEntity {
  id: string;
  idUser: string;
  name: string;
  visibility: {
    view: boolean;
    edit: boolean;
  };
  items: CardItem[];
}

export interface CardItem {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: CardTag[];
}

export interface CardTag {
  name: string;
  color: string;
}
