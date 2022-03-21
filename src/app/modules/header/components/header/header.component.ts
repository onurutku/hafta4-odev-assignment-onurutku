import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  faCartArrowDown,
  faDoorOpen,
  faShoppingBag,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Carts } from 'src/app/shared/models/carts.model';
import { UserLoggedIn } from 'src/app/shared/models/userLoggedIn.model';
import { CartsService } from 'src/app/modules/cart/services/carts.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userLoggedIn: UserLoggedIn; //user that loggedIn
  allCarts: Carts[] = []; //user cart items
  sendShopForToggle: boolean; //categories clicked or not variable
  filterWord: string | number;

  //fontawesome variables
  faCartCheck = faShoppingBag;
  faCart = faCartArrowDown;
  faRightBracket = faDoorOpen;

  //subscriptions
  removeSubs: Subscription;
  addSubscription: Subscription;
  toggleSubs: Subscription;

  constructor(
    private auth: AuthService,
    private carts: CartsService,
    private product: ProductService
  ) {}

  ngOnInit(): void {
    //get user logged in
    this.auth.userLoggedIn.subscribe((userLoggedIn: UserLoggedIn) => {
      this.userLoggedIn = userLoggedIn;
      if (this.userLoggedIn) {
        this.getCart();
      }
    });
    //trigger header shopping cart length counter on remove or add product on it
    this.removeSubs = this.carts.itemRemoved.subscribe((status) => {
      this.getCart();
    });
    //trigger header shopping cart length counter on remove or add product on it
    this.addSubscription = this.carts.itemAdded.subscribe((status) => {
      this.getCart();
    });
    //trigger header shopping cart length on remove all cart
    this.carts.allCartRemoved.subscribe((status) => {
      this.getCart();
    });
  }
  //remove subscriptions
  ngOnDestroy(): void {
    if (this.addSubscription) {
      this.addSubscription.unsubscribe();
    }
    if (this.removeSubs) {
      this.removeSubs.unsubscribe();
    }
    if (this.toggleSubs) {
      this.toggleSubs.unsubscribe();
    }
  }
  //get products in cart for lenght
  getCart(): void {
    this.allCarts = [];
    this.carts
      .getUserCarts(this.userLoggedIn.localId)
      .subscribe((userCart: Carts[]) => {
        userCart.map((cart) => {
          //object to array conversion
          Object.keys(cart).map((key) => {
            this.allCarts.push(cart[key]);
          });
        });
      });
  }
  //authservice logout method run
  logout(): void {
    this.auth.logout();
  }
  //bootstrap doesn't work i don't know why. so i added a method to toggle navbar responsive
  toggle(element: HTMLElement): void {
    if (element.classList.contains('collapse')) {
      element.classList.remove('collapse');
    } else {
      element.classList.add('collapse');
    }
  }
  toggleCategories(): void {
    if (this.sendShopForToggle) {
      this.sendShopForToggle = false;
      this.product.categoryToggle.next(false);
    } else {
      this.sendShopForToggle = true;
      this.product.categoryToggle.next(true);
    }
  }
  //to send search input to shop component
  search(): void {
    this.product.search.next(this.filterWord);
    console.log(this.filterWord);
  }
}
