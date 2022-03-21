import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './components/contact/contact.component';
import { RouterModule } from '@angular/router';
import { AuthGuardService } from '../../shared/guards/auth-guard.service';

@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ContactComponent,
        canActivate: [AuthGuardService],
      },
    ]),
  ],
  exports: [ContactComponent],
})
export class ContactModule {}
