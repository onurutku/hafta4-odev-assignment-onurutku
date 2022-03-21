import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCheck, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ProductInfo } from 'src/app/shared/models/productInfo.model';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit, OnDestroy {
  faCheck = faCheck; //fontawesome variable
  faX = faExclamation; //fontawesome variable

  imageSrc: string | File; //html src variable for image
  selectedImage: any; //angular file reader file

  productLoadForm: FormGroup;

  isDataSavedSuccessfully: boolean; //successmessge for user
  isLoading: boolean = false; //loading spinner variable

  isSavedSubscription: Subscription; //subscriptions
  constructor(private product: ProductService, private router: Router) {}

  ngOnInit(): void {
    //create a new form group and its formcontrols and validations
    this.productLoadForm = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.maxLength(25),
      ]),
      price: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      stock: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      picture: new FormControl(null, Validators.required),
    });
    //get information from service to give information to UI. on HTML
    this.isSavedSubscription = this.product.isSaveComplete.subscribe(
      (isSaved: boolean) => {
        this.isDataSavedSuccessfully = isSaved;
        this.isLoading = null; //stop loading indicator
        this.productLoadForm.reset(); //reset the form
        this.imageSrc = '../../../assets/dummy.jpg'; //a dummy image for empty situtations
        this.router.navigate(['/shop']); //route the shop
      }
    );
  }
  ngOnDestroy(): void {
    this.isSavedSubscription.unsubscribe();
  }
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      //if file input has a file

      //Angular filereader library
      const reader: FileReader = new FileReader(); //create an file reader object
      reader.onload = (ev: any) => {
        //call onload method from object
        this.imageSrc = <File>ev.target.result; //give to img src what we read with reader.
      };
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0]; //set a variable to send image to storage
    } else {
      //if user don't choose a photo ofc there is a valdiaiton but extra security
      this.imageSrc = '../../../assets/dummy.jpg';
      this.selectedImage = null;
    }
  }
  //form submit method.
  onSubmit(): void {
    this.isLoading = true;
    //create an object ot send service
    const productInfo: ProductInfo = {
      title: this.productLoadForm.get('title').value,
      price: this.productLoadForm.get('price').value,
      description: this.productLoadForm.get('description').value,
      stock: this.productLoadForm.get('stock').value,
      category: this.productLoadForm.get('category').value,
    };
    // this.product.postProductData(productInfo);
    this.product
      .upload(this.selectedImage, productInfo)
      .subscribe((data) => {}); //send storage the selected image and send other values to realtime database
  }
}
