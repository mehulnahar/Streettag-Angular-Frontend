import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'validurl'
})
export class ValidurlPipe implements PipeTransform {

  // transform(value: any, args?: any): any {
  //   return null;
  // }
  constructor(private domSanitizer: DomSanitizer) { }
  transform(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
