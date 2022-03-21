import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/shop',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('../modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('../modules/register/register.module').then(
        (m) => m.RegisterModule
      ),
  },
  {
    path: 'shop',
    loadChildren: () =>
      import('../modules/shop/shop.module').then((m) => m.ShopModule),
  },
  {
    path: 'cart/:id',
    loadChildren: () =>
      import('../modules/cart/cart.module').then((m) => m.CartModule),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('../modules/contact/contact.module').then((m) => m.ContactModule),
  },
  {
    path: 'new',
    loadChildren: () =>
      import('../modules/new/new.module').then((m) => m.NewModule),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('../modules/orders/orders.module').then((m) => m.OrdersModule),
  },
  {
    path: 'detail/:id',
    loadChildren: () =>
      import('../modules/detail/detail.module').then((m) => m.DetailModule),
  },

  {
    path: 'not-found',
    loadChildren: () =>
      import('../modules/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
  },
  //wildcard set undefined path redirect to not found component
  {
    path: '**',
    redirectTo: '/not-found',
  },
];

@NgModule({
  imports: [
    //lazy load with preloading strategy
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
