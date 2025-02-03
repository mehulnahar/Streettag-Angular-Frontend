import { Component, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html'
})
export class FullScreenComponent implements AfterViewInit {
  @ViewChild('expand') private expand!: ElementRef;
  @ViewChild('compress') private compress!: ElementRef;
  private toggle: boolean = false;
  private viewInitialized = false;

  ngAfterViewInit() {
    this.viewInitialized = true;
    // Initialize the correct icon state
    if (document.fullscreenElement) {
      this.showCompressIcon();
    } else {
      this.showExpandIcon();
    }
  }

  @HostListener('click')
  getFullscreen(): void {
    if (!this.viewInitialized || !this.expand?.nativeElement || !this.compress?.nativeElement) {
      return;
    }
    
    if (document.fullscreenElement) {
      this.exitFullscreen();
    } else {
      this.requestFullscreen();
    }
  }

  private async requestFullscreen(): Promise<void> {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
        this.showCompressIcon();
        this.toggle = true;
      }
    } catch (error) {
      console.error('Error attempting to enable fullscreen:', error);
    }
  }

  private exitFullscreen(): void {
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.showExpandIcon();
        this.toggle = false;
      }
    } catch (err) {
      console.error('Error attempting to exit fullscreen:', err);
    }
  }

  private showExpandIcon(): void {
    if (this.expand?.nativeElement && this.compress?.nativeElement) {
      this.compress.nativeElement.style.display = "none";
      this.expand.nativeElement.style.display = "block";
    }
  }

  private showCompressIcon(): void {
    if (this.expand?.nativeElement && this.compress?.nativeElement) {
      this.compress.nativeElement.style.display = "block";
      this.expand.nativeElement.style.display = "none";
    }
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    if (document.fullscreenElement) {
      this.showCompressIcon();
      this.toggle = true;
    } else {
      this.showExpandIcon();
      this.toggle = false;
    }
  }
}