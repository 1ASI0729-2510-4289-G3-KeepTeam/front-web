import { Tag } from './tag.entity';

export class Wish {
  id: string;
  title: string;
  description: string;
  url: string;
  dateCreation: Date;
  imgUrl: string;
  tags: Tag[];

  constructor() {
    this.id = '';
    this.title = '';
    this.description = '';
    this.url = '';
    this.imgUrl = '';
    this.tags = [];
    this.dateCreation = new Date();
  }
}
