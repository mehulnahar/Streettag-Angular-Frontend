import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  ElementRef,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { AjaxService } from "src/app/ajax.service";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { WhiteSpaceValidator } from "../../theme/utils/app-validators";
import { environment } from "src/environments/environment";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogModel } from "src/app/shared/confirm-dialog/confirmDialog.model";

@Component({
  selector: "app-broadcast-category",
  templateUrl: "./broadcast-category.component.html",
  styleUrls: ["./broadcast-category.component.scss"],
})
export class BroadcastCategoryComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public displayedColumns = [
    "serial_number",
    "category",
    "image",
    "created_at",
    "edit",
    "delete",
  ];
  public dataSource: any;
  public spiner: boolean = true;
  private readonly baseUrl = environment.baseUrl;
  constructor(
    private dialog: MatDialog,
    private ajaxService: AjaxService,
    private snackBar :MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getBroadcastCategory();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddMessageDialog() {
    let dialogRef = this.dialog.open(DialogAddBroadcastCategory, {});
    dialogRef.afterClosed().subscribe((result) => {
      this.getBroadcastCategory();
    });
  }

  openEditDialog(data) {
    let dialogRef = this.dialog.open(DialogEditBroadcastCategory, {
      data: { data },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getBroadcastCategory();
    });
  }

  
  OpenConfirmBox(dataObj:any){
    const message = `Are you sure you want to Delete ${dataObj.category} Category?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message)
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "700px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        const url = `${this.baseUrl}deleteBroadcastCategory`;
        this.ajaxService.post(dataObj, url).subscribe(
          (data) => {
            this.getBroadcastCategory();
            this.snackBar.open("Category has been Deleted Successfully.", null, {
              duration: 3000,
              verticalPosition: "top",
              panelClass: ["blue-snackbar"],
            });
          },
          (error) => {
              this.snackBar.open("Something went wrong, please try again", null, {
                duration: 2000,
                verticalPosition: "top",
                panelClass: ["red-snackbar"],
              });
          });
      }
    });
  }

  getBroadcastCategory() {
    const url = `${this.baseUrl}getBroadcastCategory`;
    this.ajaxService.get(url).subscribe(async (data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}

@Component({
  selector: "add-broadcastCategory",
  templateUrl: "./addCategory.html",
  styleUrls: ["./broadcast-category.component.scss"],
})
export class DialogAddBroadcastCategory {
  @ViewChild('fileInput', {static: false}) InputVar: ElementRef;
  clicked = false;
  resData: any;
  imgURL: any;
  imagePath: String;
  angForm: FormGroup;
  baseImage: any;
  public dataSource1: any;
  public showBar: Boolean = false;
  public progrees: Number;
  private readonly baseUrl = environment.baseUrl;
  constructor(
    public dialogRef: MatDialogRef<DialogAddBroadcastCategory>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private _http: HttpClient
  ) {
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      category: [
        "",
        [Validators.required, WhiteSpaceValidator.cannotContainSpace],
      ],
    });
  }

  onFileChangeImage(event) {
    if (event.target.files.length > 0) {
      if(event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/png'){
      this.baseImage = event.target.files[0];
      var reader = new FileReader();
      this.imagePath = this.baseImage;
      reader.readAsDataURL(this.baseImage);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      };
    }else{
      this.snackBar.open('Invalid file format, only jpg/jpeg/png file extension is allow.', null, {
        duration: 2500,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
      this.InputVar.nativeElement.value = ""; 
    }
  }
  }
 
  addCategory() {
    if (this.imgURL == "" || this.imgURL == null) {
      this.snackBar.open("please upload image.", null, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ["red-snackbar"],
      });
    } else if (this.angForm.status == "VALID") {
      const url = `${this.baseUrl}addBroadcastCategory`;
      var reqObj = {
        category: this.angForm.value.category,
        image: this.imgURL,
      };
      this._http
        .post(url, reqObj, {
          reportProgress: true,
          observe: "events",
        })
        .subscribe(
          (data) => {
            if (data.type === HttpEventType.UploadProgress) {
              this.showBar = true;
              this.progrees = Math.round((data.loaded / data.total) * 100);
            } else if (data.type === HttpEventType.Response) {
              this.snackBar.open(
                "Category has been Added Successfully.",
                null,
                {
                  duration: 3000,
                  verticalPosition: "top",
                  panelClass: ["blue-snackbar"],
                }
              );
              this.dialogRef.close();
            }
          },
          (error) => {
              this.snackBar.open(
                "Something went wrong , pleas try again",
                null,
                {
                  duration: 2000,
                  verticalPosition: "top",
                  panelClass: ["red-snackbar"],
                }
              );
            });
    } else {
      var errormsg = "Please pass Valid Information.";
      this.snackBar.open(errormsg, null, {
        duration: 2000,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
    }
  }
}

@Component({
  selector: "edit-broadcastCategory",
  templateUrl: "./editCategory.html",
  styleUrls: ["./broadcast-category.component.scss"],
})
export class DialogEditBroadcastCategory {
  @ViewChild('fileInput', {static: false}) InputVar: ElementRef;
  clicked = false;
  resData: any;
  imgURL: any;
  imagePath: String;
  angForm: FormGroup;
  baseImage: any;
  imageUpdated: Boolean = false;
  public dataSource1: any;
  public showBar: Boolean = false;
  public progrees: Number;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogEditBroadcastCategory>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private router: Router,
    private _http: HttpClient
  ) {
    this.createForm();
    this.imgURL = this.data.data.image;
  }

  createForm() {
    this.angForm = this.fb.group({
      category: [
        this.data.data.category,
        [Validators.required, WhiteSpaceValidator.cannotContainSpace],
      ],
    });
  }

  onFileChangeImage(event) {
    if (event.target.files.length > 0) {
      this.imageUpdated = true;
      if(event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/png'){
     
      this.baseImage = event.target.files[0];
      var reader = new FileReader();
      this.imagePath = this.baseImage;
      reader.readAsDataURL(this.baseImage);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      };
    }else{
      this.snackBar.open('Invalid file format, only jpg/jpeg/png file extension is allow.', null, {
        duration: 2500,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
      this.InputVar.nativeElement.value = ""; 
    }
    }

  }

  editCategory() {
    if (this.angForm.status == "VALID") {
      const url = `${this.baseUrl}editBroadcastCategory`;
      var reqObj = {
        category: this.angForm.value.category,
        image: this.imgURL,
        id: this.data.data.id,
        imageUpdated: this.imageUpdated,
      };
      this._http
        .post(url, reqObj, {
          reportProgress: true,
          observe: "events",
        })
        .subscribe(
          (data) => {
            if (data.type === HttpEventType.UploadProgress) {
              this.showBar = true;
              this.progrees = Math.round((data.loaded / data.total) * 100);
            } else if (data.type === HttpEventType.Response) {
              this.snackBar.open(
                "Category has been Updated Successfully.",
                null,
                {
                  duration: 3000,
                  verticalPosition: "top",
                  panelClass: ["blue-snackbar"],
                }
              );
              this.dialogRef.close();
            }
          },
          (error) => {
              this.snackBar.open(
                "Something went wrong, please try again",
                null,
                {
                  duration: 2000,
                  verticalPosition: "top",
                  panelClass: ["red-snackbar"],
                });
           }
        );
    } else {
      var errormsg = "Please pass Valid Information.";
      this.snackBar.open(errormsg, null, {
        duration: 2000,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
    }
  }
}
