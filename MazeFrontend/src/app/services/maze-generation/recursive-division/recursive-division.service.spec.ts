import { TestBed } from '@angular/core/testing';

import { RecursiveDivisionService } from './recursive-division.service';

describe('RecursiveDivisionService', () => {
  let service: RecursiveDivisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecursiveDivisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
