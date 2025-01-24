import { TestBed } from '@angular/core/testing';

import { QuesReportService } from './ques-report.service';

describe('QuesReportService', () => {
  let service: QuesReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuesReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
