import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "decodePipe",
})
export class DecodePipePipe implements PipeTransform {
  transform(value: any): any {
    if (value == "1" || value == "0") {
      if (value == "1") {
        var decodedData = "YES";
      } else {
        var decodedData = "NO";
      }
    } else {
      var decodedData = window.atob(value); // decode the string
    }

    return decodedData;
  }
}
