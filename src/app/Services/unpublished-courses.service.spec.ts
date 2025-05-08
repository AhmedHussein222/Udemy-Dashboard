import { TestBed } from '@angular/core/testing';

import { UnpublishedCoursesService } from './unpublished-courses.service';

describe('UnpublishedCoursesService', () => {
  let service: UnpublishedCoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnpublishedCoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
