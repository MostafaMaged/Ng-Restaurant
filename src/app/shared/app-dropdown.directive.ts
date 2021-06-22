import { HostBinding, HostListener } from '@angular/core';
import { Directive } from '@angular/core';

@Directive({
  selector: '[appAppDropdown]',
})
export class AppDropdownDirective {
  @HostBinding('class.open') isOpen: boolean = false;

  @HostListener('click', ['$event.target']) onClick() {
    this.isOpen = !this.isOpen;
  }
  constructor() {}
}
