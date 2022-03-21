import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { Carts } from '../../../shared/models/carts.model';
import { PostRealtimeDatabaseResponse } from '../../../shared/models/postRealtimeDbResponse.model';

@Injectable({
  providedIn: 'root',
})
export class CartsService {
  itemRemoved = new Subject<string>();
  allCartRemoved = new Subject<boolean>();
  itemAdded = new Subject<boolean>();
  constructor(private http: HttpClient) {}

  postProduct(
    userCart: Carts,
    userId: string
  ): Observable<PostRealtimeDatabaseResponse> {
    return this.http.post<PostRealtimeDatabaseResponse>(
      'https://angular-bootcamp-out-default-rtdb.europe-west1.firebasedatabase.app/users/' +
        userId +
        '/' +
        userCart.id +
        '.json',
      userCart
    );
  }
  //this method get products in users cart with using user id
  getUserCarts(id: string): Observable<Carts[]> {
    return this.http
      .get<Carts>(
        'https://angular-bootcamp-out-default-rtdb.europe-west1.firebasedatabase.app/users/' +
          id +
          '.json'
      )
      .pipe(
        map((response) => {
          const newArray: Carts[] = [];
          for (let key in response) {
            if (response.hasOwnProperty(key)) {
              newArray.push(response[key]);
            }
          }
          return newArray;
        })
      );
  }
  //delete method for cart
  deleteCarts(userId: string, productId: string): Observable<null> {
    return this.http.delete<null>(
      'https://angular-bootcamp-out-default-rtdb.europe-west1.firebasedatabase.app/users/' +
        userId +
        '/' +
        productId +
        '.json'
    );
  }
  clearCart(userId: string): Observable<null> {
    return this.http.delete<null>(
      'https://angular-bootcamp-out-default-rtdb.europe-west1.firebasedatabase.app/users/' +
        userId +
        '.json'
    );
  }
}
