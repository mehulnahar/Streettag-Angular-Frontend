import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';

interface Control {
  name: string;
  checked: boolean;
}

@Component({
  selector: 'app-top-info-content',
  templateUrl: './top-info-content.component.html',
  styleUrls: ['./top-info-content.component.scss']
})
export class TopInfoContentComponent implements OnInit {
  @Input() showInfoContent: boolean = false;
  @Output() onCloseInfoContent: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  public contactForm: FormGroup;
  public settings: Settings;
  public controls: Control[] = [
    { name: 'Notifications', checked: true },
    { name: 'Tasks', checked: true },
    { name: 'Events', checked: false },
    { name: 'Downloads', checked: true },
    { name: 'Messages', checked: true },
    { name: 'Updates', checked: false },
    { name: 'Settings', checked: true }
  ];

  constructor(public appSettings: AppSettings, public formBuilder: FormBuilder) {
    this.settings = this.appSettings.settings;
    this.contactForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  public closeInfoContent(event: boolean): void {
    this.onCloseInfoContent.emit(event);
  }

  public onContactFormSubmit(values: Object): void {
    if (this.contactForm.valid) {
      console.log(values);
    }
  }
}
