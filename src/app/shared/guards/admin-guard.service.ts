import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserLoggedIn } from '../models/userLoggedIn.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuardService implements CanActivate {
  userLoggedIn: UserLoggedIn;
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    this.auth.userLoggedIn.subscribe((userLoggedIn: UserLoggedIn) => {
      this.userLoggedIn = userLoggedIn;
    });
    if (this.userLoggedIn.email == 'admin@admin.com') {
      return true;
    } else {
      this.router.navigate(['/shop']);
      return false;
    }
  }
}
