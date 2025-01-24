import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-snack-bar",
  templateUrl: "./snack-bar.component.html",
  styleUrls: ["./snack-bar.component.scss"],
 })
export class SnackBarComponent implements OnInit {
  constructor(public snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  openSnackBar(
    message: string = "Something went wrong!",
    type: string = "error",
    duration: number = 2500
  ) {
    let className = type === "success" ? "blue-snackbar" : "red-snackbar";
    if(type == 'warning'){
     console.log('inside sncackbar')
      className = 'warning-snackbar';  
    }  
    this.snackBar.open(message, null, {
      duration: duration,
      verticalPosition: "top", // 'top' | 'bottom'
      horizontalPosition: "center", //'start' | 'center' | 'end' | 'left' | 'right';
      panelClass: [className],
    });
  }
}
