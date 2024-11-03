import { TestBed } from '@angular/core/testing';

import { KruskalService } from './random.service';

describe('KruskalService', () => {
  let service: KruskalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KruskalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
