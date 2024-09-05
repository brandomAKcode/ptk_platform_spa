import { TestBed } from '@angular/core/testing';

import { PTKStorageService } from './ptk-storage.service';

describe('PtkStorageService', () => {
  let service: PTKStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PTKStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
