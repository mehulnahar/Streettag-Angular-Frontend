import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'increase'
})
export class IncreasePipe implements PipeTransform {

  public res;

  transform(value) {

    this.res = value++; 

    return this.res;

  }

}
