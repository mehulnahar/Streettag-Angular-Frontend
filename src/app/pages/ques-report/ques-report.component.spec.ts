import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuesReportComponent } from './ques-report.component';

describe('QuesReportComponent', () => {
  let component: QuesReportComponent;
  let fixture: ComponentFixture<QuesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
