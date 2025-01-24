import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  DateAdapter,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatSnackBar,
  MatSort,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { Router } from '@angular/router';
import { Settings } from 'src/app/app.settings.model';
import { AjaxService } from 'src/app/ajax.service';
import { AppSettings } from 'src/app/app.settings';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { Observable, pipe } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs/operators';

interface Category {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-rf-device-time',
  templateUrl: './rf-device-time.component.html',
  styleUrls: ['./rf-device-time.component.scss'],
})
export class RfDeviceTimeComponent implements OnInit {
  @ViewChild('sidenav', { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private readonly baseUrl = environment.baseUrl;

  public settings: Settings;
  public sidenavOpen: boolean = true;

  public newMail: boolean;
  public type: string = 'all';
  public showSearch: boolean = false;
  public searchText: string;
  public form: FormGroup;

  public show_dialog: boolean = false;
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  Location_name = '';
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public displayedColumns = [
    'serial_number',
    'device_id',
    'device_name',
    'lat',
    'lng',
    'score',
    'actions',
  ];
  public dataSource: any;
  public dataSourceLocation: any;
  public selectedValue: string;
  public picker1;
  public picker2;

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
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 1500);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    }, 3000);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.getallCircuits();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  public getMails() {
    switch (this.type) {
    }
  }

  openEditDialog(data): void {
    let dialogRef = this.dialog.open(RfDeviceTimeEditDialog, {
      data: data,
      width: '900px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      ////console.log('The dialog was closed');
      //  this.name = result;
      //this.openDialog();
      //  this.getMsggroups();

      //  this.getallevent();
      //  this.viewDetail(result);
      //  this.toggle();
      this.getallCircuits();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(RfDeviceTimeAddDialog, {
      width: '900px',
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result) => {
      ////console.log('The dialog was closed');
      //  this.name = result;
      //this.openDialog()

      this.getallCircuits();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  getallCircuits() {
    var url = `${this.baseUrl}getRFDeviceTimeDataAll`;
    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data['data']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  confirmDialog(id) {
    var getdata = {};
    var url = `${this.baseUrl}deleteRFCircuitData`;
    var data = { id: id };

    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.resData = data;
        this.getallCircuits();
        this.snackBar.open('RF Circuit deleted Successfully!', null, {
          duration: 3000,
          verticalPosition: 'top',
        });
      },
      (error) => {
        //console.error("Error");
      }
    );
  }

  openDetailDialog(data): void {
    let dialogRef = this.dialog.open(RfDeviceTimeViewDialog, {
      width: '600px',
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getallCircuits();
    });
  }
}

@Component({
  selector: 'add-rf-device-time',
  templateUrl: 'add-rf-device-time.html',
  styleUrls: ['add-rf-device-time.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RfDeviceTimeAddDialog {
  id: number;
  edit: boolean = false;
  formateddate;
  devices: any = [];
  private readonly baseUrl = environment.baseUrl;
  resData: any;
  removable: boolean = true;
  toppingList: any = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ];

  selectdevice: any = 'all';
  mondayselect: any = new FormControl([]);
  tuesdayselect: any = new FormControl([]);
  wednesdayselect: any = new FormControl([]);
  thursdayselect: any = new FormControl([]);
  fridayselect: any = new FormControl([]);
  saturdayselect: any = new FormControl([]);
  sundayselect: any = new FormControl([]);
  rfDeviceTimeDetail: any;
  weekarray = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

  constructor(
    public dialogRef: MatDialogRef<RfDeviceTimeAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.getallDevices();
    this.dateAdapter.setLocale('en-GB');

    if (data && data.id) {
      console.log(data);
      this.edit = true;
      this.id = data.id;
      this.getfulldetails(data.id);
    }
  }
  groups = this.data;

  onNoClick(): void {
    this.dialogRef.close();
  }

  formdatasubmit() {
    let data = {
      device_id: this.selectdevice.toString(),
      dayArray: [
        { day: 'monday', timing: this.mondayselect.value.toString() },
        { day: 'tuesday', timing: this.tuesdayselect.value.toString() },
        { day: 'wednesday', timing: this.wednesdayselect.value.toString() },
        { day: 'thursday', timing: this.thursdayselect.value.toString() },
        { day: 'friday', timing: this.fridayselect.value.toString() },
        { day: 'saturday', timing: this.saturdayselect.value.toString() },
        { day: 'sunday', timing: this.sundayselect.value.toString() },
      ],
    };
    var url = `${this.baseUrl}insertRFDeviceTimeData`;

    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.resData = data;
        let dynamicSnackColor = 'blue-snackbar';
        if (this.resData.status == 'false') {
          dynamicSnackColor = 'red-snackbar';
        }
        this.snackBar.open(this.resData.msg, null, {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: dynamicSnackColor,
        });

        this.dialogRef.close();
      },
      (error) => {}
    );
  }

  getfulldetails(id) {
    var url = `${this.baseUrl}getRFDeviceTimeData`;
    let data = {
      id: id,
    };
    this.ajaxService.post(data, url).subscribe((data) => {
      this.rfDeviceTimeDetail = data['data'];
      console.log(this.rfDeviceTimeDetail);
      let weekwiseday:any = {}
      this.weekarray.forEach(element => {
        weekwiseday[element] = this.passvalue(this.rfDeviceTimeDetail, element);
      });
    });
  }

  passvalue(array, weekname) {
    let day = array.filter((it) => it.day == weekname);
    let emptyarr = [];
    if (day[0]['start_time']) {
      return day[0]['start_time'].split(',');
    } else {
      return emptyarr;
    }
  }

  getallDevices() {
    var url = `${this.baseUrl}getRFDeviceData`;
    this.ajaxService.get(url).subscribe((data) => {
      this.devices = data['data'];
    });
  }

  changeSelected($event, category): void {
    category.selected = $event.selected;
  }

  title = 'app-material3';

  categoriesControl = new FormControl([]);
  categories: any[] = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ];

  onCatRemoved(cat: string, control: string) {
    let categories;
    if (control == 'mondayselect') {
      categories = this.mondayselect.value as string[];
      this.removeFirst(categories, cat);
      this.mondayselect.setValue(categories);
    }
    if (control == 'tuesdayselect') {
      categories = this.tuesdayselect.value as string[];
      this.removeFirst(categories, cat);
      this.tuesdayselect.setValue(categories);
    }
    if (control == 'wednesdayselect') {
      categories = this.wednesdayselect.value as string[];
      this.removeFirst(categories, cat);
      this.wednesdayselect.setValue(categories);
    }
    if (control == 'thursdayselect') {
      categories = this.thursdayselect.value as string[];
      this.removeFirst(categories, cat);
      this.thursdayselect.setValue(categories);
    }
    if (control == 'fridayselect') {
      categories = this.fridayselect.value as string[];
      this.removeFirst(categories, cat);
      this.fridayselect.setValue(categories);
    }
    if (control == 'saturdayselect') {
      categories = this.saturdayselect.value as string[];
      this.removeFirst(categories, cat);
      this.saturdayselect.setValue(categories);
    }
    if (control == 'sundayselect') {
      categories = this.sundayselect.value as string[];
      this.removeFirst(categories, cat);
      this.sundayselect.setValue(categories);
    }
  }

  private removeFirst(array: any[], toRemove: any): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}

@Component({
  selector: 'rf-device-time-view-dialog',
  templateUrl: 'rf-device-time-view-dialog.html',
  styles: [
    'tr {height: 40px; border-bottom: 1px solid #b8b7b7;} th { width: 30%!important} .hrs { font-weight: 600 } ',
  ],
})
export class RfDeviceTimeViewDialog {
  keys: any = [];
  values: any = [];
  id: any;
  rfDeviceTimeDetail: any = [];
  weekwiseday: any;
  private readonly baseUrl = environment.baseUrl;
  constructor(
    public dialogRef: MatDialogRef<RfDeviceTimeViewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService
  ) {
    if (data) {
      this.id = data.id;
      this.getfulldetails();
    }
  }

  getfulldetails() {
    var url = `${this.baseUrl}getRFDeviceTimeData`;
    let data = {
      id: this.id,
    };
    this.ajaxService.post(data, url).subscribe((data) => {
      this.rfDeviceTimeDetail = data['data'];

      this.weekwiseday = {
        monday: this.passvalue(this.rfDeviceTimeDetail, 'monday'),
        tuesday: this.passvalue(this.rfDeviceTimeDetail, 'tuesday'),
        wednesday: this.passvalue(this.rfDeviceTimeDetail, 'wednesday'),
        thursday: this.passvalue(this.rfDeviceTimeDetail, 'thursday'),
        friday: this.passvalue(this.rfDeviceTimeDetail, 'friday'),
        saturday: this.passvalue(this.rfDeviceTimeDetail, 'saturday'),
        sunday: this.passvalue(this.rfDeviceTimeDetail, 'sunday'),
      };
    });
  }

  passvalue(array, weekname) {
    let day = array.filter((it) => it.day == weekname);
    let emptyarr = [];
    if (day[0]['start_time']) {
      return day[0]['start_time'].split(',');
    } else {
      return emptyarr;
    }
  }
}

@Component({
  selector: 'rf-device-time-edit-dailog',
  templateUrl: 'rf-device-time-edit-dailog.html',
})
export class RfDeviceTimeEditDialog {
  keys: any = [];
  values: any = [];
  id: any;
  rfDeviceTimeDetail: any = [];
  weekwiseday: any;
  private readonly baseUrl = environment.baseUrl;
  angForm: FormGroup;
  resData: any;
  devices: any = [];
  categoriesControl = new FormControl([]);
  categories: any[] = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ];
  mondayselect: any = [];
  tuesdayselect: any = [];
  wednesdayselect: any = [];
  thursdayselect: any = [];
  fridayselect: any = [];
  saturdayselect: any = [];
  sundayselect: any = [];
  weekarray = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

  constructor(
    public dialogRef: MatDialogRef<RfDeviceTimeEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar
  ) {
    this.getallDevices();
    this.angForm = this.formBuilder.group({
      device_id: [''],
    });
    if (data) {
      console.log(data);
      this.id = data.id;
      this.angForm.setValue({
        device_id: data.id ? data.id : 'All',
      });
      
      this.getfulldetails(data.id);
    }
  }

  getfulldetails(id) {
    var url = `${this.baseUrl}getRFDeviceTimeData`;
    let data = {
      id: id,
    };
    this.ajaxService.post(data, url).subscribe((data) => {
      this.rfDeviceTimeDetail = data['data'];      
      let weekobject:any = {}
      this.weekarray.forEach(element => {
        weekobject[element] = this.passvalue(this.rfDeviceTimeDetail, element);
      });
      this.mondayselect = weekobject.monday;
      this.tuesdayselect = weekobject.tuesday;
      this.wednesdayselect = weekobject.wednesday;
      this.thursdayselect =weekobject.thursday;
      this.fridayselect = weekobject.friday;
      this.saturdayselect = weekobject.saturday;
      this.sundayselect = weekobject.sunday;
    });
  }

  passvalue(array, weekname) {
    let day = array.filter((it) => it.day == weekname);
    let emptyarr = [];
    if (day[0]['start_time']) {
      return day[0]['start_time'].split(',').map(item=>parseInt(item));
    } else {
      return emptyarr;
    }
  }

  formsubmit() {
    let data = {
      device_id: this.angForm.get('device_id').value,
      dayArray: [
        { day: 'monday', timing: this.mondayselect.toString() },
        { day: 'tuesday', timing: this.tuesdayselect.toString() },
        { day: 'wednesday', timing: this.wednesdayselect.toString() },
        { day: 'thursday', timing: this.thursdayselect.toString() },
        { day: 'friday', timing: this.fridayselect.toString() },
        { day: 'saturday', timing: this.saturdayselect.toString() },
        { day: 'sunday', timing: this.sundayselect.toString() },
      ],
    };
    console.log(data);
    var url = `${this.baseUrl}updateRFDeviceTimeData`;

    this.ajaxService.post(data, url).subscribe((data) => {
      this.resData = data;
      let dynamicSnackColor = 'blue-snackbar';
      if (this.resData.status == 'false') {
        dynamicSnackColor = 'red-snackbar';
      }
      this.snackBar.open(this.resData.msg, null, {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: dynamicSnackColor,
      });

      this.dialogRef.close();
    },(error)=>{
    });
  }

  getallDevices() {
    var url = `${this.baseUrl}getRFDeviceData`;
    this.ajaxService.get(url).subscribe((data) => {
      this.devices = data['data'];
    });
  }

  onCatRemoved(cat: string, control: string) {
    let categories;
    console.log(cat,control)
    if (control == 'mondayselect') {
      categories = this.mondayselect as string[];
      this.removeFirst(categories, cat);
      this.mondayselect = categories;
    }
    if (control == 'tuesdayselect') {
      categories = this.tuesdayselect as string[];
      this.removeFirst(categories, cat);
      this.tuesdayselect = categories;
    }
    if (control == 'wednesdayselect') {
      categories = this.wednesdayselect as string[];
      this.removeFirst(categories, cat);
      this.wednesdayselect = categories;
    }
    if (control == 'thursdayselect') {
      categories = this.thursdayselect as string[];
      this.removeFirst(categories, cat);
      this.thursdayselect = categories;
    }
    if (control == 'fridayselect') {
      categories = this.fridayselect as string[];
      this.removeFirst(categories, cat);
      this.fridayselect = categories;
    }
    if (control == 'saturdayselect') {
      categories = this.saturdayselect as string[];
      this.removeFirst(categories, cat);
      this.saturdayselect = categories;
    }
    if (control == 'sundayselect') {
      categories = this.sundayselect as string[];
      this.removeFirst(categories, cat);
      this.sundayselect = categories;
    }
  }

  private removeFirst(array: any[], toRemove: any): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}

