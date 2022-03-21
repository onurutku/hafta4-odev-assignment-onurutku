import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterResponse } from '../models/register-response.model';
import { FormInput } from '../models/formInputs.model';
import { LoginResponse } from '../models/login-response.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserLoggedIn } from '../models/userLoggedIn.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userLoggedIn = new BehaviorSubject<UserLoggedIn>(null);
  timeForTimer: number = 3600 * 1000;
  constructor(private http: HttpClient, private router: Router) {}

  //firebase endpoint signUp method returns to register component.ts
  register(newUser: FormInput): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC1IBUpE6IQdp36Ann5eMYUqsH4WMY-Sh0',
      {
        email: newUser.email,
        password: newUser.password,
        returnSecureToken: true,
      }
    );
  }
  login(user: FormInput): Observable<LoginResponse> {
    //login method it takes form user information
    return this.http
      .post<LoginResponse>( //post method to firebase auth
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC1IBUpE6IQdp36Ann5eMYUqsH4WMY-Sh0',
        {
          //firebase authentication post methods body
          email: user.email,
          password: user.password,
          returnSecureToken: true,
        }
      )
      .pipe(
        // rxJS pipe operator for can use tap function
        tap((response: LoginResponse) => {
          // tap function that we use for sight-effect to an observiable. Because we used subscribe in a component.ts method
          const expirationDate = new Date( //this time calculation for auto logout
            new Date().getTime() + +response.expiresIn * 1000
          );
          //create an object to send behavior subject and localstorage.We'll use this observable in interceptors to create a condition to write data on database
          const userLoggedIn: UserLoggedIn = {
            email: response.email,
            localId: response.localId,
            idToken: response.idToken,
            expirationDate,
          };
          //next data with subject and create a user in sessionStorage
          this.userLoggedIn.next(userLoggedIn);
          sessionStorage.setItem('user', JSON.stringify(userLoggedIn)); //i'll use this information for auto login method.
          this.autoLogout(this.timeForTimer);
        })
      );
  }
  //auto login on page refresh
  autoLogin() {
    const sessionStorageUser = JSON.parse(sessionStorage.getItem('user')); //get data from sessionStorage for new userObject

    if (!sessionStorageUser) {
      //security return
      return;
    }
    const expirationDate = new Date(new Date().getTime() + 3600 * 1000); //set a new expiration time to auto logout

    const newUserFromStorage = {
      //new user Object for  send to interceptor and update session storage
      email: sessionStorageUser.email,
      localId: sessionStorageUser.localId,
      idToken: sessionStorageUser.idToken,
      expirationDate: expirationDate,
    };
    //update session storage for time
    sessionStorage.setItem('user', JSON.stringify(newUserFromStorage));
    this.userLoggedIn.next(newUserFromStorage); //send user again to interceptor
    this.autoLogout(this.timeForTimer); //start new timer
  }

  //logout method
  logout(): void {
    this.userLoggedIn.next(null); //this next null to subject to block data transfer to database because database needs token to transfer data for security
    sessionStorage.removeItem('user'); //also remove user from session storage to block login condition for user on pages.!
    this.router.navigate(['/login']); //route to login page
  }
  //auto logout timer
  autoLogout(time: number): void {
    setTimeout(() => {
      this.logout();
      this.router.navigate(['/login']);
    }, time);
  }
}
