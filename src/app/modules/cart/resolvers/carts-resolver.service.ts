import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Carts } from '../../../shared/models/carts.model';
import { CartsService } from '../../../modules/cart/services/carts.service';

@Injectable({
  providedIn: 'root',
})
export class CartsResolverService implements Resolve<Carts> {
  constructor(private carts: CartsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Carts | Observable<any> | Promise<Carts> {
    return this.carts.getUserCarts(route.params['id']);
  }
}
