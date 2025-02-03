import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, args?: number): string {
    let limit = args && args > 0 ? args : 10;
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}