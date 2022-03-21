import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  exports: [FooterComponent],
})
export class FooterModule {}
