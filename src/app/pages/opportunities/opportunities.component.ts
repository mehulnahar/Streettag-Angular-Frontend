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
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogModel } from "src/app/shared/confirm-dialog/confirmDialog.model";
import { pluck } from "rxjs/operators";
import { Observable } from "rxjs";

interface OpportunityData {
  id: number;
  likes: number;
  dislikes: number;
  opportunity_data: string;
  opportunity_image: string;
  opportunity_link: string;
  circuits: string;
  created_at: string;
}

// import {DeletedialogLocation} from '../../DeletedialogLocation/DeletedialogLocation.component';

//declare var $:any;
@Component({
  selector: "app-event",
  templateUrl: "./opportunities.component.html",
  styleUrls: ["./opportunities.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class OpportunitiesComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  private readonly baseUrl = environment.baseUrl;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  public newMail: boolean = false;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string = '';
  public form!: FormGroup;
  public dataSource: MatTableDataSource<OpportunityData> = new MatTableDataSource<OpportunityData>([]);
  public groupList: any[] = [];

  public show_dialog: boolean = false;
  public button_name: string = "Show Login Form!";
  delresult: any;
  resData: any;
  allLocations: any[] = [];
  Location_name: string = "";
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public displayedColumns = [
    "likes",
    "dislikes",
    "opportunity_data",
    "opportunity_image",
    "opportunity_link",
    "circuits",
    "created_at",
    "edit",
    "delete",
  ]; //'serial_number',
  public dataSourceLocation: any;
  public selectedValue: string = '';
  public foods = [
    { value: "steak-0", viewValue: "Steak" },
    { value: "pizza-1", viewValue: "Pizza" },
    { value: "tacos-2", viewValue: "Tacos" },
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
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.getallCircuits();

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

  // public viewDetail(mail){
  //   this.mail = this.mailboxService.getMail(mail.id);
  //   this.mails.forEach(m => m.selected = false);
  //   this.mail.selected = true;
  //   this.mail.unread = false;
  //   this.newMail = false;
  //   if(window.innerWidth <= 992){
  //     this.sidenav.close();
  //   }
  // }

  ////////////////////open edit dialoge/////////////////////////
  openEditDialog(event: OpportunityData): void {
    const dialogRef = this.dialog.open(DialogOverviewMessageDialogOpportunities, {
      data: { event },
      width: '500px',
      autoFocus: false,
      restoreFocus: true
    });

    dialogRef.afterClosed().subscribe({
      next: () => {
        this.getallCircuits();
      }
    });
  }

  openAddMessageDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewAddMessageDialogOpportunities, {
      data: { groups: this.groupList },
      width: '500px',
      autoFocus: false,
      restoreFocus: true
    });

    dialogRef.afterClosed().subscribe({
      next: () => {
        this.getallCircuits();
        this.toggle();
      }
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  getallLocations() {
    const url = `${this.baseUrl}getLocations`;
    this.ajaxService.get(url).subscribe((data: any) => {
      this.dataSourceLocation = data["response"];
    });
  }
  ///////////////get all event//////////////////
  getallCircuits() {
    const url = `${this.baseUrl}getOpportunities`;
    this.ajaxService.get(url).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource<OpportunityData>(data["response"]);
      this.dataSource.paginator = this.paginator;
    });
  }
 
  confirmDialog(id: number): void {
    const message = `Are you sure you want to delete this opportunity?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        this.deleteCircuit(id)
      }
    });
  }

  deleteCircuit(circuit_id: number) {
    const url = `${this.baseUrl}deleteOpportunity`;
    const data = { circuit_id };

    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.resData = data;
        this.getallCircuits();
        this.snackBar.open("Opportunity deleted Successfully!", "", {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["blue-snackbar"],
        });
      },
      (error) => {
        console.error("Error deleting opportunity:", error);
      }
    );
  }

  formatUrl(url: string): string {
    if (!url) return '';
    
    // Check if the URL starts with http:// or https://
    if (!url.match(/^https?:\/\//i)) {
      // If not, prepend https://
      url = 'https://' + url;
    }
    return url;
  }
}

@Component({
  selector: "dialog-overview-addmessage-dialog",
  templateUrl: "dialog-overview-addmessage-dialog.html",
})
export class DialogOverviewAddMessageDialogOpportunities {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  public settings!: Settings;
  form!: FormGroup;
  angForm!: FormGroup;
  public imageSrc: string = '';
  public dataSourceCircuit: any[] = [];
  public dataSourceLocation: any[] = [];
  public selectedValue: string = '';
  private readonly baseUrl = environment.baseUrl;
  public resData: any;
  public groups: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewAddMessageDialogOpportunities>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();
    this.getallCircuits();
    this.getallLocations();
    this.groups = this.data?.groups || [];
  }

  createForm() {
    this.angForm = this.fb.group({
      opportunity_data: ['', [Validators.required]],
      circuit_name: ['', [Validators.required]],
      opportunity_link: ['']
    });
  }

  getallCircuits() {
    const url = `${this.baseUrl}getCircuits`;
    this.ajaxService.get(url).subscribe((data: any) => {
      this.dataSourceCircuit = data["response"];
    });
  }

  getallLocations() {
    const url = `${this.baseUrl}getLocations`;
    this.ajaxService.get(url).subscribe((data: any) => {
      this.dataSourceLocation = data["response"];
    });
  }

  handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    const reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e: ProgressEvent<FileReader>) {
    const reader = e.target as FileReader;
    this.imageSrc = reader.result as string;
  }

  addevent() {
    if (this.angForm.status === "VALID") {
      const formValue = this.angForm.value;
      const circuit_id_arr: number[] = [];
      let circuit_id_str = "";

      this.dataSourceCircuit.forEach((item: any) => {
        for (let i = 0; i < formValue.circuit_name.length; i++) {
          if (formValue.circuit_name[i] === item.circuit_name) {
            circuit_id_arr[i] = item.id;
          }
        }
      });

      circuit_id_str = circuit_id_arr.join();

      const data = {
        circuits: formValue.circuit_name,
        opportunity_data: formValue.opportunity_data,
        opportunity_image: this.imageSrc || '',
        opportunity_link: formValue.opportunity_link || '',
        circuit_ids: circuit_id_str,
      };

      const url = `${this.baseUrl}addOpportunity`;

      this.ajaxService.post(data, url).subscribe((response: any) => {
        this.resData = response;
        this.getallCircuits();
        const dynamicSnackColor = this.resData.status === "false" ? "red-snackbar" : "blue-snackbar";
        this.snackBar.open(this.resData.msg, "", {
          duration: 3000,
          verticalPosition: "top",
          panelClass: dynamicSnackColor,
        });
        this.dialogRef.close();
      });
    }
  }
}

@Component({
  selector: "dialog-overview--dialog",
  templateUrl: "dialog-overview-message-dialog.html",
})
export class DialogOverviewMessageDialogOpportunities {
  public settings!: Settings;
  angForm!: FormGroup;
  public selectedValue: string = '';
  public imageSrc: string = '';
  public opportunity_image: string = '';
  public dataSourceCircuit: any[] = [];
  private readonly baseUrl = environment.baseUrl;
  private imageChanged: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewMessageDialogOpportunities>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar
  ) {
    this.createForm();
    this.loadData();
    this.getallCircuits();
  }

  createForm() {
    this.angForm = this.fb.group({
      opportunity_data: ['', [Validators.required]],
      circuit_name: ['', [Validators.required]],
      opportunity_link: ['']
    });
  }

  loadData() {
    if (this.data.event) {
      this.opportunity_image = this.data.event.opportunity_image;
      this.angForm.patchValue({
        opportunity_data: this.data.event.opportunity_data,
        opportunity_link: this.data.event.opportunity_link,
        circuit_name: this.data.event.circuits.split(',')
      });
    }
  }

  getallCircuits() {
    const url = `${this.baseUrl}getCircuits`;
    this.ajaxService.get(url).subscribe((data: any) => {
      this.dataSourceCircuit = data["response"];
    });
  }

  handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    if (!file.type.match(/image-*/)) {
      return;
    }
    this.imageChanged = true;
    const reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e: ProgressEvent<FileReader>) {
    const reader = e.target as FileReader;
    this.imageSrc = reader.result as string;
    this.opportunity_image = this.imageSrc; // Update preview
  }

  updateevent() {
    if (this.angForm.valid) {
      const formValue = this.angForm.value;
      const data = {
        opportunity_id: this.data.event.id,
        circuits: formValue.circuit_name,
        opportunity_data: formValue.opportunity_data,
        opportunity_image: this.imageChanged ? this.imageSrc : "not selected",
        opportunity_link: formValue.opportunity_link,
        circuit_ids: this.getCircuitIds()
      };

      const url = `${this.baseUrl}editOpportunity`;

      this.ajaxService.post(data, url).subscribe((response: any) => {
        this.snackBar.open(response.msg, "", {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["blue-snackbar"],
        });
        this.dialogRef.close();
      });
    }
  }

  private getCircuitIds(): string {
    const formValue = this.angForm.value;
    const circuit_id_arr: number[] = [];
    this.dataSourceCircuit.forEach((item: any) => {
      if (formValue.circuit_name.includes(item.circuit_name)) {
        circuit_id_arr.push(item.id);
      }
    });
    return circuit_id_arr.join(',');
  }

  closeDialog(group: any) {
    this.dialogRef.close(group);
  }
}


