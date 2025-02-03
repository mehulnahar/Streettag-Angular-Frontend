import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decode'
})
export class DecodePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    try {
      return atob(value);
    } catch (e) {
      return value;
    }
  }
} 