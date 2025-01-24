import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serialNumber',
  })
export class SerialNumberPipe implements PipeTransform {

  transform(value: number, pageSize : number , pageIndex : number): Number {
    return (pageSize*pageIndex)+(value+1) ;
  }

}
