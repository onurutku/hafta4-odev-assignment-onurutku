import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { Order } from '../../../shared/models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  orderShipped = new Subject<any>(); //subject for create a subscirbe for order shipping to listen on orders page
  constructor(private http: HttpClient) {}
  //send order to database,this creates by users
  createOrder(order: any, userId: string): Observable<Order> {
    return this.http.post<Order>(
      'https://angular-bootcamp-out-default-rtdb.europe-west1.firebasedatabase.app/orders/' +
        userId +
        '.json',
      order
    );
  }
  //for get all orders this can see only by ADMIN
  getAllOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(
        'https://angular-bootcamp-out-default-rtdb.europe-west1.firebasedatabase.app/orders.json'
      )
      .pipe(
        map((response) => {
          const newArr = [];
          for (let key in response) {
            if (response.hasOwnProperty(key)) {
              newArr.push(response[key]);
            }
          }
          return newArr;
        })
      );
  }
  //simulation of shipping order
  shipOrder(
    userId: string,
    orderId: string,
    orderIndex: string
  ): Observable<null> {
    return this.http.delete<null>(
      'https://angular-bootcamp-out-default-rtdb.europe-west1.firebasedatabase.app/orders/' +
        userId +
        '/' +
        orderId +
        '/' +
        orderIndex +
        '.json'
    );
  }
}
