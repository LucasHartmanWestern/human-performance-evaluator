import { TestBed } from '@angular/core/testing';

import { FormEndpointsService } from './form-endpoints.service';

describe('FormEndpointsService', () => {
  let service: FormEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormEndpointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
