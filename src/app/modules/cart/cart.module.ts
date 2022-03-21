import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartComponent } from './components/cart/cart.component';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuardService } from '../../shared/guards/auth-guard.service';
import { CartsResolverService } from './resolvers/carts-resolver.service';

@NgModule({
  declarations: [CartComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CartComponent,
        canActivate: [AuthGuardService],
        resolve: { carts: CartsResolverService },
      },
    ]),
    FontAwesomeModule,
    SharedModule,
  ],
  exports: [CartComponent],
})
export class CartModule {}
