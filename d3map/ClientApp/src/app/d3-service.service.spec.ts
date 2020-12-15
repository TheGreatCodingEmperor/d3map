import { TestBed } from '@angular/core/testing';

import { D3ServiceService } from './d3-service.service';

describe('D3ServiceService', () => {
  let service: D3ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(D3ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
