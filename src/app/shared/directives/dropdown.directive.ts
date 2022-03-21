import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective implements OnInit {
  @HostListener('document:click', ['$event.target']) onClick(e) {
    //event listener for whole doucment
    if (e == this.elRef.nativeElement) {
      // a condition to get where i clicking!
      if (
        //if show already have
        this.elRef.nativeElement.nextElementSibling.classList.contains('show')
      ) {
        //it will delete it
        this.elRef.nativeElement.nextElementSibling.classList.remove('show');
      } else {
        //it will add on it
        this.elRef.nativeElement.nextElementSibling.classList.add('show');
      }
      //if i click another area on whole page
    } else {
      this.elRef.nativeElement.nextElementSibling.classList.remove('show');
    }
  }
  constructor(private elRef: ElementRef) {}
  ngOnInit(): void {}
}
