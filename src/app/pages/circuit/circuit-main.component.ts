import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";
import { AjaxService } from "src/app/ajax.service";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { environment } from "src/environments/environment";
import { DialogOverviewAddMessageDialogCircuit } from "./dialog-overview-addmessage-dialog";
import { DialogOverviewMessageDialogCircuit } from "./dialog-overview-message-dialog";
import { DeleteDialogCircuit } from "./delete-dialog-circuit";

interface Circuit {
  id: string;
  circuit_name: string;
  location_name: string;
  location_id: string;
  start_date: string;
  end_date: string;
  serial_number?: number;
}

interface CircuitResponse {
  response: Circuit[];
  status?: string;
  msg?: string;
}

@Component({
  selector: "app-circuit",
  templateUrl: "./circuit.component.html",
  styleUrls: ["./circuit.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CircuitComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public settings: Settings;
  public searchText = '';
  public dataSource!: MatTableDataSource<Circuit>;
  public displayedColumns = [
    "serial_number",
    "circuit_name",
    "location_name",
    "start_date",
    "end_date",
    "actions",
  ];

  private readonly baseUrl = environment.baseUrl;

  constructor(
    public appSettings: AppSettings,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.getallCircuits();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.dataSource) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }, 1000);
  }

  applyFilter(filterValue: string) {
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  openEditDialog(event: Circuit): void {
    const dialogRef = this.dialog.open(DialogOverviewMessageDialogCircuit, {
      data: { event },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getallCircuits();
    });
  }

  openAddMessageDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewAddMessageDialogCircuit, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getallCircuits();
    });
  }

  openDeleteDialog(circuit: Circuit): void {
    const dialogRef = this.dialog.open(DeleteDialogCircuit, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.deleteCircuit(circuit.id);
      }
    });
  }

  getallCircuits() {
    const url = `${this.baseUrl}getCircuits`;

    this.ajaxService.get<CircuitResponse>(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Circuit>(data.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  private deleteCircuit(circuit_id: string) {
    const url = `${this.baseUrl}deleteCircuit`;
    const data = { circuit_id };

    this.ajaxService.post(data, url).subscribe(
      (response: any) => {
        this.getallCircuits();
        this.snackBar.open("Circuit deleted Successfully!", undefined, {
          duration: 3000,
          verticalPosition: "top",
        });
      },
      (error) => {
        console.error("Error deleting circuit:", error);
        this.snackBar.open("Error deleting circuit", undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
      }
    );
  }
} 