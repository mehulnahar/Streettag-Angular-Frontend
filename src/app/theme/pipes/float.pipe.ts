import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'float'
})
export class FloatPipe implements PipeTransform {

  transform(value: string): any {
    return parseFloat(value);
  }

}
