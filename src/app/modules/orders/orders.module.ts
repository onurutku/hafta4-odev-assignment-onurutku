import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './components/orders/orders.component';
import { RouterModule } from '@angular/router';
import { AuthGuardService } from '../../shared/guards/auth-guard.service';
import { AdminGuardService } from '../../shared/guards/admin-guard.service';
import { OrderResolverService } from './resolvers/order-resolver.service';

@NgModule({
  declarations: [OrdersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: OrdersComponent,
        canActivate: [AuthGuardService, AdminGuardService],
        resolve: { orders: OrderResolverService },
      },
    ]),
  ],
  exports: [OrdersComponent],
})
export class OrdersModule {}
