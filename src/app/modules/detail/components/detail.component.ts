import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  faCheck,
  faComment,
  faExclamation,
  faPencilAlt,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Carts } from 'src/app/shared/models/carts.model';
import { Comment } from 'src/app/shared/models/comment.model';
import { Products } from 'src/app/shared/models/products.model';
import { UserLoggedIn } from 'src/app/shared/models/userLoggedIn.model';
import { CartsService } from 'src/app/modules/cart/services/carts.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  @ViewChild('input', { static: false }) input: ElementRef;
  //fontAwesome variables
  faPlus = faPlus;
  faComment = faComment;
  faPen = faPencilAlt;
  faX = faExclamation;
  faCheck = faCheck;

  //describe the formGroup
  commentForm: FormGroup;

  //dynamic toggle buttons variable for detail page
  isOpen: boolean = true;
  isCommnetsOpen: boolean = true;
  isWriteCommentOpen: boolean = false;
  // userId: string; //variable for get id from url

  //subscription variables
  paramsSubscription: Subscription;
  userSubscription: Subscription;
  productIdSusbscription: Subscription;
  commentSubscription: Subscription;

  productId: string; //product id variable
  productById: Products; //a variable for use on html
  userLoggedIn: UserLoggedIn; //variable for user logged in
  comments = []; //for hold all comment for this product
  isCommentSavedSuccessfully: boolean; //saved message conditioner
  isLoading: boolean; //loading spinner conditioner
  isDeleted: boolean; //delete message conditioner
  addedToCart: boolean; //if addtoCart is complete success

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private product: ProductService,
    private router: Router,
    private cart: CartsService
  ) {}

  ngOnInit(): void {
    //this method uses detail resolver to get data.
    this.paramsSubscription = this.route.data.subscribe((product: Products) => {
      this.productById = product['product'];
      if (this.productById.comments) {
        this.comments = Object.keys(this.productById.comments).map(
          (key) => this.productById.comments[key]
        );
      }
    });
    //a subject trigger after a comment came for product subscription for that can load on page
    this.commentSubscription = this.product.commentCame.subscribe(() => {
      this.getDataWithId();
    });
    //get product id for use comment push
    this.productIdSusbscription = this.route.params.subscribe(
      (params: Params) => {
        this.productId = params['id'];
      }
    );
    //create reactive Form
    this.commentForm = new FormGroup({
      comment: new FormControl(null, Validators.required),
    });

    //get user who logged in
    this.userSubscription = this.auth.userLoggedIn.subscribe(
      (userLoggedIn: UserLoggedIn) => {
        this.userLoggedIn = userLoggedIn;
      }
    );
  }
  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe(); //unsubscribe paramsubscription
    this.userSubscription.unsubscribe(); //unsubscribe usersubscription
    this.productIdSusbscription.unsubscribe(); //unsusbcribe productIdSubscription
    this.commentSubscription.unsubscribe(); //unsubscribe commentSubscription
  }
  //togglebutton for description
  toggle(): void {
    this.isOpen ? (this.isOpen = false) : (this.isOpen = true);
  }
  //toggle button for comment
  commentToggle(): void {
    if (this.isCommnetsOpen) {
      this.isCommnetsOpen = false;
    } else {
      this.isCommnetsOpen = true;
      this.isWriteCommentOpen = false;
    }
  }
  //toggle button for open or close comment textarea
  writeCommentToggle(): void {
    if (this.isWriteCommentOpen) {
      this.isWriteCommentOpen = false;
    } else {
      this.isWriteCommentOpen = true;
      this.isCommnetsOpen = false;
    }
  }
  //quantity add button
  plus(value: number): void {
    if (value < this.productById.stock) {
      value++;
      this.input.nativeElement.value = value;
    }
  }
  //quantity minus button and a ifcondition for negative numbers
  minus(value: number): void {
    if (this.input.nativeElement.value != 0) {
      value--;
    }
    this.input.nativeElement.value = value;
  }
  //send data to cart service.
  addToCart(): void {
    //create a userCart to send database with userid
    const userCart: Carts = {
      quantity: this.input.nativeElement.value,
      description: this.productById.description,
      imagePath: this.productById.imagePath,
      price: this.productById.price,
      stock: this.productById.stock,
      title: this.productById.title,
      id: this.productId,
    };
    //check stock to add cart
    if (this.input.nativeElement.value <= this.productById.stock) {
      this.cart.postProduct(userCart, this.userLoggedIn.localId).subscribe(
        () => {
          this.cart.itemAdded.next(true);
          this.addedToCart = true;
          setTimeout(() => {
            //route to the cart page
            this.router.navigate(['/cart', this.userLoggedIn.localId]);
          }, 1500);
        },
        (error) => {
          this.addedToCart = false;
        }
      );
    }
  }
  onSubmit(): void {
    this.isLoading = true; //activate loading spinner on html
    //create an object to send database
    const comment: Comment = {
      comment: this.commentForm.get('comment').value,
      email: this.userLoggedIn.email,
    };
    //call the post method on product service
    this.product.postCommentWithId(this.productId, comment).subscribe(() => {
      this.commentForm.reset();
      this.product.commentCame.next(true); //subject next for trigger reGet product data to page without refresh the page
    });
  }
  //delete production method
  onDelete(): void {
    this.isLoading = true;
    this.product.deleteProduct(this.productId).subscribe(
      (response: null) => {
        this.isDeleted = true;
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/shop']); //route the shop
        }, 1500);
      },
      //error handling for delete method
      (error) => {
        this.isDeleted = false;
      }
    );
  }
  //get data when a  new comment came to page.
  getDataWithId(): void {
    this.product.getDataWithId(this.productId).subscribe(
      (product: Products) => {
        this.isLoading = false; //close the spinner
        this.isCommentSavedSuccessfully = true; //show data saved successfully

        setTimeout(() => {
          //a timer for show saved message successfully and redirect comments page
          this.commentToggle(); //call toggle method to close write comment and open all comments
        }, 1000);
        this.productById = product;
        if (this.productById.comments) {
          //this is transform object to array
          this.comments = Object.keys(this.productById.comments).map(
            (key) => this.productById.comments[key]
          );
        }
      },
      //error handling for comment push to database
      (error) => {
        this.isCommentSavedSuccessfully = false;
      }
    );
  }
}
