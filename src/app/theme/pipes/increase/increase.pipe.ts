import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'increase'
})
export class IncreasePipe implements PipeTransform {
  public res: number = 0;

  transform(value: number): number {
    this.res = value++; 
    return this.res;
  }
}
