import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appHoverColorChange]'
})
export class HoverColorChangeDirective {

  constructor() { }

  @HostListener('mouseover') onHover() {
    window.alert("hover");
  }

}
