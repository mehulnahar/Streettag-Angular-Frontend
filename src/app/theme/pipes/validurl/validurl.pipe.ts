import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Pipe({
  name: 'validurl'
})
export class ValidurlPipe implements PipeTransform {

  // transform(value: any, args?: any): any {
  //   return null;
  // }
  constructor(private domSanitizer: DomSanitizer) { }
  transform(url) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
