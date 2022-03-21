import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Subject, map, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Comment } from '../models/comment.model';
import { PostRealtimeDatabaseResponse } from '../models/postRealtimeDbResponse.model';
import { ProductInfo } from '../models/productInfo.model';
import { Products } from '../models/products.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  //firebase storage library variables
  fileRef: any;
  filePath: string;

  isSaveComplete = new Subject<boolean>(); //subject for trigger save new product
  commentCame = new Subject<boolean>(); //subject for trigger comemnts
  category = new Subject<string>(); //trigger for category select
  search = new Subject<any>(); //search bar value to shop component
  categoryToggle = new Subject<boolean>(); //toggle for show category or not

  constructor(private http: HttpClient, private storage: AngularFireStorage) {}

  //this method for use upload image metadata and other information from product form!
  upload(selectedImage: File, productInfo: ProductInfo): Observable<any> {
    this.filePath = `images/${selectedImage.name}_${new Date().getTime()}`; //create a path for firebase storage
    this.fileRef = this.storage.ref(this.filePath); //get the referance of file in storage

    return this.storage
      .upload(this.filePath, selectedImage) //firestorage library method to save file to selected path.
      .snapshotChanges()
      .pipe(
        //for another observable
        finalize(() => {
          //create a new object to send realtime database form info and image URL
          this.fileRef.getDownloadURL().subscribe((imageUrl) => {
            //get image url from firebase storage
            const newProductInfo: ProductInfo = {
              title: productInfo.title,
              price: productInfo.price,
              description: productInfo.description,
              stock: productInfo.stock,
              category: productInfo.category,
              imagePath: imageUrl,
            };
            //call the method which will post data to realtime database
            this.postProductData(newProductInfo).subscribe(
              () => {
                this.isSaveComplete.next(true); //this is a subject next for give information to UI
              },
              (error) => {
                this.isSaveComplete.next(false); //this is a subject next for give information to UI
              }
            );
          });
        })
      );
  }
  //realtime database post method. admin will use to add product.
  postProductData(
    productInfo: ProductInfo
  ): Observable<PostRealtimeDatabaseResponse> {
    return this.http.post<PostRealtimeDatabaseResponse>(
      'https://angular-bootcamp-out-default-rtdb.europe-west1.firebasedatabase.app/products.json',
      productInfo
    );
  }
  //get all data from database for shop page
  getAllData(): Observable<Products[]> {
    return this.http
      .get<Products>(
        'https://angular-bootcamp-out-default-rtdb.europe-west1.firebasedatabase.app/products.json'
      )
      .pipe(
        //for create new array
        map((products: Products) => {
          const array = [];
          for (let id in products) {
            if (products.hasOwnProperty(id)) {
              array.push({ ...products[id], id: id });
            }
          }
          return array;
        })
      );
  }
  //get only one data with id for detail page
  getDataWithId(id: string): Observable<Products> {
    return this.http
      .get<Products>(
        'https://angular-bootcamp-out-default-rtdb.europe-west1.firebasedatabase.app/products/' +
          id +
          '.json'
      )
      .pipe(
        map((product) => {
          return product;
        })
      );
  }
  //save comment on database with id
  postCommentWithId(
    productId: string,
    comment: Comment
  ): Observable<PostRealtimeDatabaseResponse> {
    return this.http.post<PostRealtimeDatabaseResponse>(
      'https://angular-bootcamp-out-default-rtdb.europe-west1.firebasedatabase.app/products/' +
        productId +
        '/comments.json',
      comment
    );
  }
  deleteProduct(productId: string): Observable<PostRealtimeDatabaseResponse> {
    return this.http.delete<PostRealtimeDatabaseResponse>(
      'https://angular-bootcamp-out-default-rtdb.europe-west1.firebasedatabase.app/products/' +
        productId +
        '.json'
    );
  }
}
