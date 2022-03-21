import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AuthService } from '../shared/services/auth.service';
import { AuthGuardService } from '../shared/guards/auth-guard.service';
import { LoginModule } from '../modules/login/login.module';
import { RegisterModule } from '../modules/register/register.module';
import { NotFoundModule } from '../modules/not-found/not-found.module';
import { HeaderModule } from '../modules/header/header.module';
import { FooterModule } from '../modules/footer/footer.module';
import { ShopModule } from '../modules/shop/shop.module';
import { SharedModule } from '../shared/shared.module';
import { CartModule } from '../modules/cart/cart.module';
import { DetailModule } from '../modules/detail/detail.module';
import { OrdersModule } from '../modules/orders/orders.module';
import { NewModule } from '../modules/new/new.module';
import { ContactModule } from '../modules/contact/contact.module';
import { CartsService } from '../modules/cart/services/carts.service';
import { ProductService } from '../shared/services/product.service';
import { OrdersService } from '../modules/orders/services/orders.service';
import { ShopResolverService } from '../modules/shop/resolvers/shop-resolver.service';
import { DetailResolverService } from '../modules/detail/resolvers/detail-resolver.service';
import { CartsResolverService } from '../modules/cart/resolvers/carts-resolver.service';
import { OrderResolverService } from '../modules/orders/resolvers/order-resolver.service';
import { AdminGuardService } from '../shared/guards/admin-guard.service';
import { AuthInterceptor } from '../shared/interceptors/auth.interceptor';
import { AppComponent } from './components/app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    LoginModule,
    RegisterModule,
    NotFoundModule,
    HeaderModule,
    FooterModule,
    ShopModule,
    SharedModule,
    CartModule,
    DetailModule,
    OrdersModule,
    NewModule,
    ContactModule,
  ],
  providers: [
    AuthService,
    CartsService,
    ProductService,
    OrdersService,
    ShopResolverService,
    DetailResolverService,
    CartsResolverService,
    ShopResolverService,
    OrderResolverService,
    AuthGuardService,
    AdminGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, //interceptor definition
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
