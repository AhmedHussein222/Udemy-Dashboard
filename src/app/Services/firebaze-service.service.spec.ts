import { TestBed } from '@angular/core/testing';

import { FirebazeServiceService } from './firebaze-service.service';

describe('FirebazeServiceService', () => {
  let service: FirebazeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebazeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
