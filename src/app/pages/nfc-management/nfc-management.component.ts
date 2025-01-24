import { Component, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {Subscription} from 'rxjs';
import {distinctUntilChanged, filter, map} from 'rxjs/operators';
import { environment } from "src/environments/environment";
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

import {
  MatTableDataSource,
  MatPaginator,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSort,
  MatAutocompleteSelectedEvent,
  MatDialogConfig,
} from "@angular/material";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";
import { SnackBarComponent } from "src/app/shared/snack-bar/snack-bar.component";
import { NfcService } from "./nfc.service";

export interface NfcData {
  serial_number : number
  player_id : string
  email : string
  fullname : string,
  device_typr : string,
  comment : string,
  created_at : string
}
export enum deviceTypes {
  android = 'android',
  ios = 'ios'
}

@Component({
  selector: 'app-nfc-management',
  templateUrl: './nfc-management.component.html',
  styleUrls: ['./nfc-management.component.scss'],
})
export class NfcManagementComponent implements OnInit {

  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string;
  public form: FormGroup;
  resData: any;
  public displayedColumns = [
    "serial_number",
    "player_id",
    "userName",
    "dob",
    "gender",
    "team_name",
    "created_at",
  ];
  public dataSource: MatTableDataSource<NfcData>;
  private readonly baseUrl = environment.baseUrl;


  constructor(
    private appSettings: AppSettings,
    private dialog: MatDialog,
    public snackbar: SnackBarComponent,
    private api : NfcService
    ) {
    this.settings = this.appSettings.settings;
    }

  ngOnInit() {
    this.getChildNfcData();
   }

   getChildNfcData(){
    this.api.getNfcPlayers({type : 'child'}).subscribe((result) => {
      this.dataSource = new MatTableDataSource<NfcData>(result["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
   }


  applyFilter(filterValue: string) {
       this.dataSource.filter = filterValue.trim().toLowerCase();
   }

  openAddMessageDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "60%";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['animate__animated','animate__zoomIn'];
    let dialogRef = this.dialog.open(AddNfcDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this.getChildNfcData();
    });
  }

}



@Component({
  selector: "app-blank",
  templateUrl: "./addNfc-dialog.html",
  styleUrls: ['./nfc-management.component.scss'],
})
export class AddNfcDialog implements OnInit , OnDestroy {
  error: boolean = false;
  isLoading = false;
  errorMsg: string;
  public child : any;
  searchPlayerCtrl = new FormControl('',Validators.required);
  deviceTypeCtrl = new FormControl('',Validators.required);
  commentTypeCtrl = new FormControl('');
  filteredPlayers: any;
  private readonly baseUrl = environment.baseUrl;
  $filteredplayers: Subscription;
  _deviceTypes = deviceTypes;
  showCard: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddNfcDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: SnackBarComponent,
    private api : NfcService
  ) {}

  trackByFn(index, item) {    
    return item.id; 
 }


 ngOnInit(){
  this.$filteredplayers = this.searchPlayerCtrl.valueChanges
  .pipe(
    filter(res => res.length > 2),
    debounceTime(600),
    distinctUntilChanged(),
    tap(() => {
      this.errorMsg = "";
      this.filteredPlayers = [];
      this.isLoading = true;
    }),
    switchMap(value => this.api.searchChild( {searchKey : this.searchPlayerCtrl.value.trim()})
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
    )
  )
  .subscribe(data => {
    if (data['response'].length === 0) {
      this.errorMsg = 'Player not found!';
      this.filteredPlayers = [];
    } else {
      this.errorMsg = "";
      this.filteredPlayers = data['response'];
    }
  });
}
 

  /**
   *
   *
   * @memberof AddNfcDialog
   */
  Submit() {

    if(this.child.is_nfc) {
      this.snackbar.openSnackBar("NFC already activated for this player.",'warning', 3000);
      return;
    }


    this.api.setChildAsNfc(this.child).
    subscribe(
      (data) => {
        this.snackbar.openSnackBar("NFC added Successfully.",'success', 2500);
        this.dialogRef.close();
      },
      (error) => {
        this.snackbar.openSnackBar(error.error.msg,'error', 2500);
      });
  }

  displayFn(player:any): string {
    return player && window.atob(player.player_id)
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    console.log(event.option.value);
        this.child = event.option.value;
        this.showCard = true;
  }

  ngOnDestroy(){
    if(this.$filteredplayers)this.$filteredplayers.unsubscribe();
  }
  
  close(){
    document
    .getElementsByClassName('animate__animated')[0]
    .classList.remove('animate__zoomIn');
  document
    .getElementsByClassName('animate__animated')[0]
    .classList.add('animate__zoomOut');
  setTimeout(() => {
    this.dialogRef.close();
  }, 400);
  }
}

