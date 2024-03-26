import { TestBed } from '@angular/core/testing';

import { DriveApiService } from './drive-api.service';

describe('DriveApiService', () => {
  let service: DriveApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriveApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
