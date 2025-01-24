import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ConfirmDialogModel } from "./confirmDialog.model";

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.scss"],
})
export class ConfirmDialogComponent implements OnInit {
  title: string;
  message: string;
 
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel
  ) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit() {}

  onConfirm(): void {
    // Close the dialog, return payload
    this.dialogRef.close(true);
  }

  onDismiss():void{
  // Close the dialog, return payload
    //checking animation available
  if(document.getElementsByClassName('animate__animated')[0]){
    document
    .getElementsByClassName('animate__animated')[0]
    .classList.remove('animate__zoomIn');
    document
    .getElementsByClassName('animate__animated')[0]
    .classList.add('animate__zoomOut');
    setTimeout(() => {
      this.dialogRef.close(false);
    }, 400);
  }else{
    this.dialogRef.close(false);
  }
  }
}


