import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from '../../../shared/models/order.model';
import { OrdersService } from '../services/orders.service';

@Injectable({
  providedIn: 'root',
})
export class OrderResolverService implements Resolve<Order> {
  constructor(private orders: OrdersService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Order | Observable<any> | Promise<Order> {
    return this.orders.getAllOrders();
  }
}
