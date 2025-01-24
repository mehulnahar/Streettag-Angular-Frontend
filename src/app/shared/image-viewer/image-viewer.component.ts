import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageViewergModel } from './image-viewer.model';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

  title: string;
  message: string;
  url : string;
 
  constructor(
    public dialogRef: MatDialogRef<ImageViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageViewergModel  ) {
    this.title = data.title;
    this.message = data.message;
    this.url = data.imageUrl;
  }

  ngOnInit() {}

  onConfirm(): void {
    // Close the dialog, return payload
    this.dialogRef.close(true);
  }

  onDismiss():void{
  // Close the dialog, return payload
  this.dialogRef.close(false);
  }

}
