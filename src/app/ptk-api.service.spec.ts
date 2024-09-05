import { TestBed } from '@angular/core/testing';

import { PtkApiService } from './ptk-api.service';

describe('PtkApiService', () => {
  let service: PtkApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PtkApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
