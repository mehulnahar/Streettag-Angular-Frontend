import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-blank',
  templateUrl: './deletedialog.component.html',
  styleUrls: ['./deletedialog.component.scss']
})



export class DeleteDialog {
  
  constructor(
    public dialogRef: MatDialogRef<DeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {

     }


 
     Submit(x)
     {
        this.dialogRef.close(x);
     }

  

  





}

