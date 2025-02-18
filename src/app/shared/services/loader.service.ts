import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.isLoading.asObservable();
  private cdr: ChangeDetectorRef | null = null;

  setCdr(cdr: ChangeDetectorRef) {
    this.cdr = cdr;
  }

  show() {
    this.isLoading.next(true);
    if (this.cdr) {
      this.cdr.detectChanges();
    }
  }

  hide() {
    this.isLoading.next(false);
    if (this.cdr) {
      this.cdr.detectChanges();
    }
  }
} 