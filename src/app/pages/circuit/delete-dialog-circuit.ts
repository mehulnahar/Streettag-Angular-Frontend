import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog-circuit',
  templateUrl: './DeletedialogCircuit.dialog.html',
})
export class DeleteDialogCircuit {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogCircuit>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  Submit(result: number) {
    this.dialogRef.close(result);
  }
} 