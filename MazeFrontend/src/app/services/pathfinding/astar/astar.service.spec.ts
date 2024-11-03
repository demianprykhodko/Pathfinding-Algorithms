import { TestBed } from '@angular/core/testing';

import { BfsService } from './astar.service';

describe('BfsService', () => {
  let service: BfsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BfsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
