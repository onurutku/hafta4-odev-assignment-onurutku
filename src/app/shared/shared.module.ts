import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { DropdownDirective } from './directives/dropdown.directive';
import { SearchPipe } from './pipes/search.pipe';

@NgModule({
  declarations: [LoadingSpinnerComponent, DropdownDirective, SearchPipe],
  imports: [CommonModule],
  exports: [LoadingSpinnerComponent, DropdownDirective, SearchPipe],
})
export class SharedModule {}
