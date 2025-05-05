import {Tag} from './tag.entity';

export class Wish {
  id=''
  title = ''
  description = ''
  url = ''
  imgUrl = ''
  tags: Tag[] = [];
}
