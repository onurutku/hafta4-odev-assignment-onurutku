import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { Carts } from 'src/app/shared/models/carts.model';
import { Order } from 'src/app/shared/models/order.model';
import { UserLoggedIn } from 'src/app/shared/models/userLoggedIn.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrdersService } from 'src/app/modules/orders/services/orders.service';
import { CartsService } from '../../services/carts.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  userLoggedIn: UserLoggedIn; //user logged in variable

  //subscription variables
  userSubscription: Subscription;
  cartSubscription: Subscription;
  itemRemoveSusbscription: Subscription;
  removeCartSubs: Subscription;

  allCarts: Carts[] = []; //cart variable
  checkOut: boolean; //checkout message variable
  errorMessage: string; //error variable

  //price calculation variables for summary
  subTotal: number = 0;
  shipping: number;
  tax: number;
  total: number;

  constructor(
    private auth: AuthService,
    private carts: CartsService,
    private orders: OrdersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.auth.userLoggedIn.subscribe(
      (userLoggedIn: UserLoggedIn) => {
        this.userLoggedIn = userLoggedIn;
        this.getUserCart();
      }
    );
    //item remove subscription method
    this.itemRemoveSusbscription = this.carts.itemRemoved.subscribe((data) => {
      this.allCarts.forEach((cart) => {
        //remove exact true item from cart
        if (cart.id == data) {
          if (this.allCarts.indexOf(cart) > -1) {
            this.allCarts.splice(this.allCarts.indexOf(cart), 1);
            this.subTotal -= +cart.price; //decrease prive from summary
            this.calculateSummary(); //recalculate summary
            if (this.allCarts.length == 0) {
              //if it is last item on cart
              this.subTotal = 0;
            }
          }
        }
      });
    });
    //remove cart subject subscription to clear user cart
    this.removeCartSubs = this.carts.allCartRemoved.subscribe(() => {
      this.allCarts = [];
      if (this.allCarts.length == 0) {
        //if it is last item on cart
        this.subTotal = 0;
      }
      this.calculateSummary();
    });
  }
  //unsubscibe methods
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.itemRemoveSusbscription) {
      this.itemRemoveSusbscription.unsubscribe();
    }
    if (this.removeCartSubs) {
      this.removeCartSubs.unsubscribe();
    }
  }
  //this method return all products of users in users carts
  getUserCart(): void {
    //resolver for get carts
    this.route.data.subscribe((carts: Data) => {
      carts.carts.map((cart) => {
        Object.keys(cart).map((key) => {
          //object to array conversion
          this.allCarts?.push(cart[key]);
        });
      });
      this.allCarts?.forEach((element) => {
        this.subTotal += element.price * +element.quantity;
      });
      this.calculateSummary();
    });
  }
  //delete method for cart item
  onDelete(productId: string): void {
    this.carts.deleteCarts(this.userLoggedIn.localId, productId).subscribe(
      (data) => {
        this.carts.itemRemoved.next(productId);
      },
      (error) => {
        this.errorMessage = 'Error Occured! Try again...';
      }
    );
  }
  //price calculations
  calculateSummary(): void {
    this.subTotal = +this.subTotal.toFixed(2);
    this.shipping = +(this.subTotal * 0.1).toFixed(2);
    this.tax = +((this.shipping + this.subTotal) * 0.18).toFixed(2);
    this.total = +(this.tax + this.shipping + this.subTotal).toFixed(2);
  }
  //create an order
  createOrder(): void {
    if (this.allCarts.length != 0) {
      //if there is a product on cart
      const orders = [];
      this.allCarts.forEach((product) => {
        const order: Order = {
          description: product.description,
          productId: product.id,
          imagePath: product.imagePath,
          title: product.title,
          price: product.price,
          stock: product.stock,
          quantity: product.quantity,
          userEmail: this.userLoggedIn.email,
          userId: this.userLoggedIn.localId,
        };
        orders.push(order);
      });
      this.orders.createOrder(orders, this.userLoggedIn.localId).subscribe(
        (data: any) => {
          this.checkOut = true; //order complete
          this.clearCart();
        },
        (error) => {
          this.checkOut = false; //error occured
        }
      ); //order service method calls
    }
  }
  //clear user cart
  clearCart() {
    this.carts.clearCart(this.userLoggedIn.localId).subscribe(() => {
      this.carts.allCartRemoved.next(true);
    });
  }
}
