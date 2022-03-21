import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './components/detail.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuardService } from '../../shared/guards/auth-guard.service';
import { DetailResolverService } from './resolvers/detail-resolver.service';

@NgModule({
  declarations: [DetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DetailComponent,
        canActivate: [AuthGuardService], //guard for auth
        resolve: { product: DetailResolverService }, //this method enter between router and service. and before you route the new page. Service run method and you can get data before you go the page.
      },
    ]),
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [DetailComponent],
})
export class DetailModule {}
