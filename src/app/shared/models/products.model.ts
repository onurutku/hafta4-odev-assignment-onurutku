import { Comment } from './comment.model';

export interface Products {
  description: string;
  id: string;
  imagePath: string;
  price: number;
  stock: number;
  title: string;
  comments?: Comment;
  category: string;
}
