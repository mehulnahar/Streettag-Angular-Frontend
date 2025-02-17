import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'src/app/ajax.service';
import { environment } from 'src/environments/environment';

interface Category {
  id: number;
  serial_number: number;
  category: string;
  image: string;
  created_at: string;
}

@Component({
  selector: 'add-category-dialog',
  template: `
    <h2 mat-dialog-title>Add Category</h2>
    <mat-dialog-content>
      <form [formGroup]="categoryForm">
        <mat-form-field appearance="outline" style="width: 100%">
          <mat-label>Category</mat-label>
          <input matInput formControlName="category" placeholder="Enter category name">
          <mat-error *ngIf="categoryForm.get('category')?.hasError('required')">
            Category is required.
          </mat-error>
        </mat-form-field>

        <div style="margin: 20px 0">
          <button mat-stroked-button (click)="fileInput.click()" style="width: 100%">
            <mat-icon>cloud_upload</mat-icon>
            Select Images File
          </button>
          <input hidden (change)="onFileSelected($event)" #fileInput type="file" accept="image/*">
          <div *ngIf="selectedImage" style="margin-top: 10px">
            Selected file: {{selectedImage.name}}
          </div>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" 
              [disabled]="!categoryForm.valid || !selectedImage || isSubmitting"
              (click)="submit()">
        Submit
      </button>
    </mat-dialog-actions>
  `
})
export class AddCategoryDialogComponent {
  categoryForm: FormGroup;
  selectedImage: File | null = null;
  isSubmitting = false;
  base64Image: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    private ajaxService: AjaxService,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.fb.group({
      category: ['', Validators.required]
    });
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.match(/image\/*/) == null) {
        this.snackBar.open('Only images are supported', undefined, {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        return;
      }
      this.selectedImage = file;
      
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.base64Image = reader.result as string;
      };
    }
  }

  submit() {
    if (this.categoryForm.valid && this.selectedImage) {
      this.isSubmitting = true;
      
      const payload = {
        category: this.categoryForm.get('category')?.value,
        image: this.base64Image
      };

      const url = `${environment.baseUrl}addBroadcastCategory`;
      this.ajaxService.post(payload, url).subscribe(
        (response: any) => {
          this.isSubmitting = false;
          if (response.status === 'true') {
            this.snackBar.open('Category added successfully', undefined, {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['blue-snackbar']
            });
            this.dialogRef.close(true);
          } else {
            this.snackBar.open('Failed to add category', undefined, {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar']
            });
          }
        },
        error => {
          this.isSubmitting = false;
          this.snackBar.open('Error adding category', undefined, {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['red-snackbar']
          });
        }
      );
    }
  }
}

@Component({
  selector: 'edit-category-dialog',
  template: `
    <h2 mat-dialog-title>Edit Category</h2>
    <mat-dialog-content>
      <form [formGroup]="categoryForm">
        <mat-form-field appearance="outline" style="width: 100%">
          <mat-label>Category</mat-label>
          <input matInput formControlName="category" placeholder="Enter category name">
          <mat-error *ngIf="categoryForm.get('category')?.hasError('required')">
            Category is required.
          </mat-error>
        </mat-form-field>

        <div style="margin: 20px 0">
          <div class="current-image" *ngIf="currentImage">
            <img [src]="currentImage" style="width: 100px; height: 100px; border-radius: 8px; margin-bottom: 10px;">
          </div>
          <button mat-stroked-button (click)="fileInput.click()" style="width: 100%">
            <mat-icon>cloud_upload</mat-icon>
            Select Images File
          </button>
          <input hidden (change)="onFileSelected($event)" #fileInput type="file" accept="image/*">
          <div *ngIf="selectedImage" style="margin-top: 10px">
            Selected file: {{selectedImage.name}}
          </div>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" 
              [disabled]="!categoryForm.valid || isSubmitting"
              (click)="submit()">
        Update
      </button>
    </mat-dialog-actions>
  `
})
export class EditCategoryDialogComponent {
  categoryForm: FormGroup;
  selectedImage: File | null = null;
  isSubmitting = false;
  base64Image: string = '';
  currentImage: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private ajaxService: AjaxService,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.fb.group({
      category: [data.category, Validators.required]
    });
    this.currentImage = data.image;
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.match(/image\/*/) == null) {
        this.snackBar.open('Only images are supported', undefined, {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        return;
      }
      this.selectedImage = file;
      
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.base64Image = reader.result as string;
      };
    }
  }

  submit() {
    if (this.categoryForm.valid) {
      this.isSubmitting = true;
      
      const payload = {
        id: this.data.id,
        category: this.categoryForm.get('category')?.value,
        image: this.base64Image || this.currentImage,
        imageUpdated: !!this.selectedImage
      };

      const url = `${environment.baseUrl}editBroadcastCategory`;
      this.ajaxService.post(payload, url).subscribe(
        (response: any) => {
          this.isSubmitting = false;
          if (response.status === 'true') {
            this.snackBar.open('Category updated successfully', undefined, {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['blue-snackbar']
            });
            this.dialogRef.close(true);
          } else {
            this.snackBar.open('Failed to update category', undefined, {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar']
            });
          }
        },
        error => {
          this.isSubmitting = false;
          this.snackBar.open('Error updating category', undefined, {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['red-snackbar']
          });
        }
      );
    }
  }
}

@Component({
  selector: 'delete-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Action</h2>
    <mat-dialog-content>
      Are you sure you want to Delete {{data.category}} Category?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close (click)="onNoClick()">No</button>
      <button mat-raised-button color="warn" (click)="onYesClick()">Yes</button>
    </mat-dialog-actions>
  `
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private ajaxService: AjaxService,
    private snackBar: MatSnackBar
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    const url = `${environment.baseUrl}deleteBroadcastCategory`;
    const payload = { id: this.data.id };
    
    this.ajaxService.post(payload, url).subscribe(
      (response: any) => {
        if (response.status === 'true') {
          this.snackBar.open('Category deleted successfully', undefined, {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['blue-snackbar']
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open('Failed to delete category', undefined, {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['red-snackbar']
          });
          this.dialogRef.close(false);
        }
      },
      error => {
        this.snackBar.open('Error deleting category', undefined, {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        this.dialogRef.close(false);
      }
    );
  }
}

@Component({
  selector: 'app-broadcast-category',
  template: `
    <app-content-header 
      [title]="'Broadcast Category'" 
      [icon]="'category'"
      [hideBreadcrumb]="true"
      [hasBgImage]="true" 
      [class]="'pb-0 pt-2'">
    </app-content-header>

    <mat-toolbar color="primary" fxLayout="row" fxLayoutAlign="space-between center">
      <button mat-raised-button color="accent" (click)="openAddMessageDialog()" class="compose" fxShow="false" fxShow.gt-xs>
        Add Category
      </button>
    </mat-toolbar>

    <div fxLayout="column" class="p-2">
      <div class="p-2" style="margin-bottom: 30px;">
        <div fxLayout="column" class="mat-elevation-z8">
          <mat-form-field class="px-3 py-1">
            <input matInput [(ngModel)]="searchText" (keyup)="applyFilter($event)" placeholder="Type to filter all columns">
          </mat-form-field>
        </div>

        <mat-table #table [dataSource]="dataSource" matSort class="mat-elevation-z8">
          <ng-container matColumnDef="serial_number">
            <mat-header-cell *matHeaderCellDef mat-sort-header>S.No.</mat-header-cell>
            <mat-cell *matCellDef="let element">{{element.serial_number}}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="category">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Category</mat-header-cell>
            <mat-cell *matCellDef="let element">{{element.category}}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="image">
            <mat-header-cell *matHeaderCellDef>Posted Images</mat-header-cell>
            <mat-cell *matCellDef="let element">
              <img [src]="element.image" style="margin:10px; height:100px; width:110px; border-radius: 8px;">
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="created_at">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Date</mat-header-cell>
            <mat-cell *matCellDef="let element">{{element.created_at | date}}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="edit">
            <mat-header-cell *matHeaderCellDef>Edit</mat-header-cell>
            <mat-cell *matCellDef="let element">
              <button mat-icon-button (click)="openEditDialog(element)">
                <mat-icon matListIcon matTooltip="Edit Category">edit</mat-icon>
              </button>
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="delete">
            <mat-header-cell *matHeaderCellDef>Delete</mat-header-cell>
            <mat-cell *matCellDef="let element">
              <button mat-icon-button (click)="OpenConfirmBox(element)">
                <mat-icon matListIcon matTooltip="Delete Category">delete</mat-icon>
              </button>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
        </mat-table>
        <mat-paginator #paginator [pageSize]="5" [pageSizeOptions]="[5, 10, 20]"></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .mat-form-field {
      width: 100%;
    }

    .mat-header-cell {
      font-weight: bold;
      color: rgba(0, 0, 0, 0.87);
    }

    .mat-cell img {
      object-fit: cover;
    }

    .mat-row:hover {
      background: rgba(0, 0, 0, 0.04);
    }

    .mat-column-serial_number {
      flex: 0 0 80px;
    }

    .mat-column-image {
      flex: 0 0 130px;
    }

    .mat-column-edit, .mat-column-delete {
      flex: 0 0 60px;
      justify-content: center;
    }
  `]
})
export class BroadcastCategoryComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  displayedColumns = ['serial_number', 'category', 'image', 'created_at', 'edit', 'delete'];
  dataSource!: MatTableDataSource<Category>;
  searchText: string = '';
  private readonly baseUrl = environment.baseUrl;

  constructor(
    private snackBar: MatSnackBar,
    private ajaxService: AjaxService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  loadCategories() {
    const url = `${this.baseUrl}getBroadcastCategory`;
    this.ajaxService.get(url).subscribe(
      (data: any) => {
        this.dataSource = new MatTableDataSource(data.response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.snackBar.open('Failed to load categories!', undefined, {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    );
  }

  openAddMessageDialog() {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  openEditDialog(element: Category) {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      width: '500px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  OpenConfirmBox(element: Category) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }
} 