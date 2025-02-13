import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html'
})
export class FullScreenComponent implements AfterViewInit {
  @ViewChild('expand') private expand!: ElementRef;
  @ViewChild('compress') private compress!: ElementRef;
  
  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.showExpandIcon();
      this.cdr.detectChanges();
    });
  }

  toggleFullScreen(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        this.showCompressIcon();
        this.cdr.detectChanges();
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        this.showExpandIcon();
        this.cdr.detectChanges();
      }).catch((err) => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  }

  private showExpandIcon(): void {
    if (this.expand?.nativeElement && this.compress?.nativeElement) {
      try {
        this.expand.nativeElement.style.display = "block";
        this.compress.nativeElement.style.display = "none";
      } catch (error) {
        console.error('Error updating expand icon:', error);
      }
    }
  }

  private showCompressIcon(): void {
    if (this.expand?.nativeElement && this.compress?.nativeElement) {
      try {
        this.expand.nativeElement.style.display = "none";
        this.compress.nativeElement.style.display = "block";
      } catch (error) {
        console.error('Error updating compress icon:', error);
      }
    }
  }
}