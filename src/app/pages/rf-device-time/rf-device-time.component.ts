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
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { DateAdapter } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Settings } from 'src/app/app.settings.model';
import { AjaxService } from 'src/app/ajax.service';
import { AppSettings } from 'src/app/app.settings';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs/operators';

interface RfDeviceData {
  id: number;
  device_id: string;
  device_name: string;
  score: string;
  lat: string;
  lng: string;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  status: boolean;
  msg: string;
  data: T;
}

interface DialogData {
  id?: number;
  device_id?: string;
  device_name?: string;
  [key: string]: any;
}

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
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  
  private readonly baseUrl = environment.baseUrl;
  public deviceId: string = '';
  public deviceName: string = '';
  public settings: Settings;
  public sidenavOpen: boolean = true;
  public newMail: boolean = false;
  public type: string = 'all';
  public showSearch: boolean = false;
  public searchText: string = '';
  public form: FormGroup;
  public show_dialog: boolean = false;
  public groupList: any[] = [];
  public delresult: any;
  public resData: any;
  public displayedColumns = [
    'serial_number',
    'device_id',
    'device_name',
    'score',
    'lat',
    'lng',
    'actions'
  ];
  public dataSource!: MatTableDataSource<RfDeviceData>;
  
  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    private ajaxService: AjaxService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.settings = this.appSettings.settings;
    this.form = this.formBuilder.group({
      to: ['', Validators.required],
      cc: null,
      subject: null,
      message: null,
    });
    this.dataSource = new MatTableDataSource<RfDeviceData>([]);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 1500);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    }, 3000);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    // Get device details from route parameters
    this.route.queryParams.subscribe(params => {
      this.deviceId = params['deviceId'];
      this.deviceName = params['deviceName'];
      if (this.deviceId && this.deviceName) {
        this.getDeviceTimeData();
      }
    });

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

  openEditDialog(data: RfDeviceData): void {
    const dialogRef = this.dialog.open(RfDeviceTimeEditDialog, {
      width: '700px',
      data: data
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (this.deviceId) {
          this.getDeviceTimeData();
        } else {
          this.getallCircuits();
        }
      }
    });
  }

  openAddMessageDialog(): void {
    const dialogRef = this.dialog.open(RfDeviceTimeAddDialog, {
      width: '700px',
      data: { deviceId: this.deviceId, deviceName: this.deviceName }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getDeviceTimeData();
      }
      this.toggle();
    });
  }

  toggle() {
    this.show_dialog = !this.show_dialog;
  }

  getallCircuits() {
    const url = `${this.baseUrl}getRFDeviceTimeDataAll`;
    this.ajaxService.get<ApiResponse<RfDeviceData[]>>(url).subscribe((response) => {
      if (response?.data) {
        this.dataSource = new MatTableDataSource<RfDeviceData>(response.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  confirmDialog(id: any) {
    var url = `${this.baseUrl}deleteRFCircuitData`;
    var data = { id: id };

    this.ajaxService.post<ApiResponse<any>>(data, url).subscribe(
      (response) => {
        this.resData = response;
        this.getallCircuits();
        this.snackBar.open('RF Circuit deleted Successfully!', undefined, {
          duration: 3000,
          verticalPosition: 'top',
        });
      },
      (error) => {
        //console.error("Error");
      }
    );
  }

  openDetailDialog(data: any): void {
    let dialogRef = this.dialog.open(RfDeviceTimeViewDialog, {
      width: '600px',
      data: data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.getallCircuits();
    });
  }

  getDeviceTimeData() {
    const url = `${this.baseUrl}getRFDeviceTimeData`;
    const data = {
      device_id: this.deviceId
    };
    
    this.ajaxService.post<ApiResponse<RfDeviceData[]>>(data, url).subscribe(
      (response) => {
        if (response?.data) {
          this.dataSource.data = response.data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (error) => {
        this.snackBar.open('Error fetching device time data', undefined, {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    );
  }
}

@Component({
  selector: 'add-rf-device-time',
  templateUrl: 'add-rf-device-time.html',
  styleUrls: ['add-rf-device-time.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RfDeviceTimeAddDialog {
  private readonly baseUrl = environment.baseUrl;
  id!: number;
  edit: boolean = false;
  formateddate!: any;
  devices = [
    {
      id: 101,
      device_id: "RFB101",
      device_name: "RF BOX 101",
      score: "50",
      lat: "22.753300376804898",
      lng: "75.8645967888855",
      is_deleted: 0,
      created_at: "2022-08-03T12:04:31.000Z",
      updated_at: "2022-09-08T12:39:06.000Z"
    },
    {
      id: 102,
      device_id: "RFB102",
      device_name: "RF BOX 102",
      score: "50",
      lat: "22.751979657998888",
      lng: "75.86447340727082",
      is_deleted: 0,
      created_at: "2022-09-02T12:00:17.000Z",
      updated_at: "2022-09-08T12:40:02.000Z"
    },
    {
      id: 103,
      device_id: "RFB103",
      device_name: "RF BOX 103",
      score: "50",
      lat: "22.75243960444233",
      lng: "75.86770815134278",
      is_deleted: 0,
      created_at: "2022-09-02T12:04:17.000Z",
      updated_at: "2022-09-07T14:23:55.000Z"
    },
    {
      id: 104,
      device_id: "RFB104",
      device_name: "RF BOX 104",
      score: "50",
      lat: "22.7533052",
      lng: "75.8650474",
      is_deleted: 0,
      created_at: "2022-11-02T10:10:33.000Z",
      updated_at: "2022-11-02T10:10:33.000Z"
    },
    {
      id: 105,
      device_id: "RFB105",
      device_name: "RF BOX 105",
      score: "50",
      lat: "22.7533052",
      lng: "75.8650474",
      is_deleted: 0,
      created_at: "2022-12-02T10:15:36.000Z",
      updated_at: "2022-12-02T10:15:36.000Z"
    },
    {
      id: 106,
      device_id: "RFB106",
      device_name: "RF BOX 106",
      score: "50",
      lat: "22.7533052",
      lng: "75.8650474",
      is_deleted: 0,
      created_at: "2022-12-14T17:27:02.000Z",
      updated_at: "2022-12-14T17:27:02.000Z"
    },
    {
      id: 107,
      device_id: "RFB107",
      device_name: "RF BOX 107",
      score: "50",
      lat: "51.5339834",
      lng: "0.0753218",
      is_deleted: 0,
      created_at: "2022-12-14T17:27:47.000Z",
      updated_at: "2022-12-14T17:27:47.000Z"
    }
  ];
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

    this.ajaxService.post<ApiResponse<any>>(data, url).subscribe(
      (response) => {
        this.resData = response;
        let dynamicSnackColor = 'blue-snackbar';
        if (this.resData.status === 'false') {
          dynamicSnackColor = 'red-snackbar';
        }
        this.snackBar.open(this.resData.msg, undefined, {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: dynamicSnackColor,
        });

        this.dialogRef.close();
      }
    );
  }

  getfulldetails(id: any) {
    const url = `${this.baseUrl}getRFDeviceTimeData`;
    const data = { id: id };
    
    this.ajaxService.post<ApiResponse<RfDeviceData>>(data, url).subscribe(
      (response) => {
        if (response?.data) {
          this.rfDeviceTimeDetail = response.data;
        }
      }
    );
  }

  passvalue(array: string[], weekname: string): string[] {
    if (array && array.length > 0) {
      return array;
    } else {
      const emptyarr: string[] = [];
      return emptyarr;
    }
  }

  changeSelected($event: any, category: any): void {
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
    const url = `${this.baseUrl}getRFDeviceTimeData`;
    const data = {
      id: this.id,
    };
    
    this.ajaxService.post<ApiResponse<any>>(data, url).subscribe((response) => {
      if (response?.data) {
        this.rfDeviceTimeDetail = response.data;
        
        const weekwiseday = {
          monday: this.passvalue(this.rfDeviceTimeDetail, 'monday'),
          tuesday: this.passvalue(this.rfDeviceTimeDetail, 'tuesday'),
          wednesday: this.passvalue(this.rfDeviceTimeDetail, 'wednesday'),
          thursday: this.passvalue(this.rfDeviceTimeDetail, 'thursday'),
          friday: this.passvalue(this.rfDeviceTimeDetail, 'friday'),
          saturday: this.passvalue(this.rfDeviceTimeDetail, 'saturday'),
          sunday: this.passvalue(this.rfDeviceTimeDetail, 'sunday'),
        };
        this.weekwiseday = weekwiseday;
      }
    });
  }

  passvalue(array: any[], weekname: string): string[] {
    const day = array.filter((it: any) => it.day === weekname);
    if (day[0]?.['start_time']) {
      return day[0]['start_time'].split(',');
    }
    return [];
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
    this.angForm = this.formBuilder.group({
      device_id: [{value: '', disabled: true}],
    });
    if (data) {
      console.log(data);
      this.id = data.id;
      this.angForm.patchValue({
        device_id: data.id
      });
      this.devices = [{
        id: data.id,
        device_id: data.device_id,
        device_name: data.device_name
      }];
      this.getfulldetails(data.id);
    }
  }

  getfulldetails(id: any) {
    var url = `${this.baseUrl}getRFDeviceTimeData`;
    let data = {
      id: id,
    };
    this.ajaxService.post<ApiResponse<any>>(data, url).subscribe((response) => {
      if (response?.data) {
        this.rfDeviceTimeDetail = response.data;      
        let weekobject: any = {}
        this.weekarray.forEach(element => {
          weekobject[element] = this.passvalue(this.rfDeviceTimeDetail, element);
        });
        this.mondayselect = weekobject.monday;
        this.tuesdayselect = weekobject.tuesday;
        this.wednesdayselect = weekobject.wednesday;
        this.thursdayselect = weekobject.thursday;
        this.fridayselect = weekobject.friday;
        this.saturdayselect = weekobject.saturday;
        this.sundayselect = weekobject.sunday;
      }
    });
  }

  passvalue(array: any, weekname: any) {
    let day = array.filter((it: any) => it.day == weekname);
    let emptyarr: any = [];
    if (day[0]['start_time']) {
      return day[0]['start_time'].split(',').map((item: any) => parseInt(item));
    } else {
      return emptyarr;
    }
  }

  formsubmit() {
    let data = {
      device_id: this.angForm.get('device_id')?.value,
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

    this.ajaxService.post<ApiResponse<any>>(data, url).subscribe(
      (response) => {
        this.resData = response;
        if (this.resData.status) {
          this.snackBar.open(this.resData.msg || 'Updated successfully', undefined, {
            duration: 3000,
            verticalPosition: 'top',
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(this.resData.msg || 'Update failed', undefined, {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['red-snackbar']
          });
        }
      },
      (error) => {
        this.snackBar.open('Error updating data', undefined, {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    );
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

