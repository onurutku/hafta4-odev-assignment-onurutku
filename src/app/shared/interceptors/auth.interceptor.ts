import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserLoggedIn } from '../models/userLoggedIn.model';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  userLoggedIn: UserLoggedIn;
  constructor(private auth: AuthService, private router: Router) {}

  //This is a stopper for requests. When you send a request to API. first of all request comes here and stops. I modified the request like that if userloggedIn subject is not null i'm adding a 'user' param and 'token' from backend on its body. if it is null, default request send to API. but in backend side on firebase i have a rule auth!=null so this is the security rule for send data without login.!
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.auth.userLoggedIn.subscribe((userLoggedIn: UserLoggedIn) => {
      this.userLoggedIn = userLoggedIn;
    });
    if (!this.userLoggedIn) {
      return next.handle(request);
    } else {
      const modifiedRequest = request.clone({
        params: new HttpParams().set('auth', this.userLoggedIn.idToken),
      });
      return next.handle(modifiedRequest);
    }
  }
}
