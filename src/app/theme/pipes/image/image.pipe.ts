import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  public icon: any;
  public url: any;

  transform(value: any): any {

    this.url = value;

    this.icon = {
      url: this.url,
      scaledSize: {
        width: 40,
        height: 40
      }
    }

    return this.icon;

  }

}
