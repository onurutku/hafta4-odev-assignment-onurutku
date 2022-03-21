import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewComponent } from './components/new/new.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuardService } from '../../shared/guards/auth-guard.service';
import { AdminGuardService } from '../../shared/guards/admin-guard.service';

@NgModule({
  declarations: [NewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: NewComponent,
        canActivate: [AuthGuardService, AdminGuardService],
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [NewComponent],
})
export class NewModule {}
