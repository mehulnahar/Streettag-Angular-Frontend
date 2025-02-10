import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
  Inject,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";
import { AjaxService } from "src/app/ajax.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { environment } from "src/environments/environment";
import { map } from 'rxjs/operators';

interface ApiResponse {
  response: any[];
  status: string;
  message: string;
}

interface Fruit {
  id: number;
  serial_number: number;
  card_name: string;
  fruit_name: string;
  fruit_image: string;
  qr_code_path: string;
  score: string;
  qr_code_data: string;
  created_at: string;
  updated_at: string;
  is_deleted: number;
  last_player_id: string;
  qid: string;
  totalScans: number;
}

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  private readonly baseUrl = environment.baseUrl;

  public settings: Settings;
  public sidenavOpen: boolean = true;

  public newMail!: boolean;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText!: string;
  public form!: FormGroup;

  public show_dialog: boolean = false;
  public button_name: any = "Show Login Form!";
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  Location_name = "";
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public displayedColumns = ['serial_number', 'card_name', 'fruit', 'score_points', 'qr_code_path'];
  public dataSource = new MatTableDataSource<Fruit>([]);
  public dataSourceLocation: any;
  public selectedValue!: string;
  public picker1!: any;
  public picker2!: any;
  public foods = [
    { value: "steak-0", viewValue: "Steak" },
    { value: "pizza-1", viewValue: "Pizza" },
    { value: "tacos-2", viewValue: "Tacos" },
  ];
  fruits: Fruit[] = [
    {
      id: 10662168,
      serial_number: 1,
      card_name: 'ef 10',
      fruit_name: 'Pineapple',
      fruit_image: 'https://streettagbucket.s3.eu-west-2.amazonaws.com/icons/pineapple_card.png',
      qr_code_path: 'https://streettagbucket.s3.eu-west-2.amazonaws.com/fruit_card_qr/1739185651876',
      score: '2000',
      qr_code_data: '10662168#STCARD#22.687753409022594#75.86512943003625',
      created_at: '2025-02-10T11:07:31.000Z',
      updated_at: '2025-02-10T11:07:34.000Z',
      is_deleted: 0,
      last_player_id: '',
      qid: '10662168',
      totalScans: 0
    }
  ];
  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.getFruitCardData();

    this.form = this.formBuilder.group({
      to: ["", Validators.required],
      cc: null,
      subject: null,
      message: null,
    });
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  public getMails() {
    switch (this.type) {
    }
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewAddMessageDialogCircuit, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result) => {
      ////console.log('The dialog was closed');
      //  this.name = result;
      //this.openDialog()

      this.getFruitCardData();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  getFruitCardData() {
    const url = `${this.baseUrl}getFruitCardData`;
    this.ajaxService.get(url).pipe(
      map(response => response as ApiResponse)
    ).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data.response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.snackBar.open('Failed to fetch fruit card data', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  public openFruitDetails(fruit: Fruit): void {
    let dialogRef = this.dialog.open(DialogOverviewAddMessageDialogCircuit, {
      width: '500px',
      data: { fruit: fruit }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Fruit details updated successfully', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  addToCart(fruit: Fruit) {
    this.snackBar.open(`Added ${fruit.fruit_name} to cart`, 'Close', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  updateQuantity(fruit: Fruit, change: number) {
    const newQuantity = fruit.totalScans + change;
    if (newQuantity >= 0) {
      fruit.totalScans = newQuantity;
      this.snackBar.open(`Updated ${fruit.fruit_name} scans to ${newQuantity}`, 'Close', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['info-snackbar']
      });
    }
  }

  getallLocations() {
    const url = `${this.baseUrl}getLocations`;
    this.ajaxService.get(url).pipe(
      map(response => response as ApiResponse)
    ).subscribe(data => {
      this.dataSourceLocation = data.response;
    });
  }

  generateQR() {
    let dialogRef = this.dialog.open(AddFruitCardDialog, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getFruitCardData(); // Refresh the table data
      }
    });
  }
}

@Component({
  selector: "dialog-overview-addmessage-dialog",
  templateUrl: "dialog-overview-addmessage-dialog.html",
})
export class DialogOverviewAddMessageDialogCircuit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  public settings!: Settings;
  angForm!: FormGroup;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewAddMessageDialogCircuit>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      name: [this.data.fruit?.fruit_name || '', [Validators.required]],
      description: [this.data.fruit?.qr_code_data || '', [Validators.required]],
      price: [this.data.fruit?.score || '', [Validators.required, Validators.min(0)]],
      quantity: [this.data.fruit?.totalScans || '', [Validators.required, Validators.min(0)]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addevent() {
    if (this.angForm.valid) {
      const formValue = this.angForm.value;
      if (this.data.fruit) {
        // Update existing fruit
        Object.assign(this.data.fruit, formValue);
        this.dialogRef.close(this.data.fruit);
      } else {
        // Add new fruit
        this.dialogRef.close(formValue);
      }
    }
  }
}

@Component({
  selector: 'add-fruit-card-dialog',
  template: `
    <div class="fruit-dialog">
      <h2 mat-dialog-title>Add Fruit Card</h2>
      <form [formGroup]="fruitForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <mat-form-field appearance="outline" class="w-100 mb-3">
            <mat-label>Select Fruit</mat-label>
            <mat-select formControlName="fruit_id">
              <mat-option *ngFor="let fruit of availableFruits" [value]="fruit.id">
                {{fruit.name}} {{fruit.points}}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="fruitForm.get('fruit_id')?.hasError('required')">
              Please select a fruit
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Card Name</mat-label>
            <input matInput formControlName="card_name" placeholder="Enter card name">
            <mat-error *ngIf="fruitForm.get('card_name')?.hasError('required')">
              Card name is required
            </mat-error>
          </mat-form-field>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!fruitForm.valid || isSubmitting">
            Add QR
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `
})
export class AddFruitCardDialog implements OnInit {
  fruitForm: FormGroup;
  isSubmitting = false;
  availableFruits = [
    { id: 1, name: 'Apple', points: '3500' },
    { id: 2, name: 'Banana', points: '1000' },
    { id: 3, name: 'Mushroom', points: '10000' },
    { id: 4, name: 'Pineapple', points: '2000' },
    { id: 5, name: 'Strawberry', points: '1500' },
    { id: 6, name: 'Sweetcorn', points: '3000' }
  ];

  constructor(
    public dialogRef: MatDialogRef<AddFruitCardDialog>,
    private fb: FormBuilder,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar
  ) {
    this.fruitForm = this.fb.group({
      fruit_id: ['', Validators.required],
      card_name: ['', Validators.required]
    });
  }

  ngOnInit() {
    // You can uncomment this if you want to fetch fruits from API
    // this.getAllFruits();
  }

  // getAllFruits() {
  //   const url = `${environment.baseUrl}getAllFruits`;
  //   this.ajaxService.get(url).subscribe({
  //     next: (response: any) => {
  //       if (response.status === 'true' || response.status === true) {
  //         this.availableFruits = response.response;
  //       }
  //     },
  //     error: (error) => {
  //       this.snackBar.open('Failed to fetch fruits', 'Close', {
  //         duration: 2000,
  //         horizontalPosition: 'right',
  //         verticalPosition: 'top',
  //         panelClass: ['error-snackbar']
  //       });
  //     }
  //   });
  // }

  onSubmit() {
    if (this.fruitForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const url = `${environment.baseUrl}addFruitCard`;
      
      this.ajaxService.post(this.fruitForm.value, url).subscribe({
        next: (response: any) => {
          if (response.status === 'true' || response.status === true) {
            this.snackBar.open('Fruit card added successfully', 'Close', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true);
          } else {
            this.snackBar.open(response.message || 'Failed to add fruit card', 'Close', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.snackBar.open('Failed to add fruit card', 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}


