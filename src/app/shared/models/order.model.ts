import { Carts } from './carts.model';
import { UserLoggedIn } from './userLoggedIn.model';

export interface Order {
  description: string;
  id?: string;
  imagePath: string;
  index?: number;
  price: number;
  productId: string;
  quantity: string;
  stock: number;
  title: string;
  userEmail: string;
  userId: string;
}
