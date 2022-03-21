import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Products } from '../../../shared/models/products.model';
import { ProductService } from '../../../shared/services/product.service';

@Injectable({
  providedIn: 'root',
})
export class DetailResolverService implements Resolve<Products> {
  constructor(private product: ProductService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Products | Observable<any> | Promise<Products> {
    return this.product.getDataWithId(route.params['id']);
  }
}
