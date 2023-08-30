import { TestBed } from '@angular/core/testing';

import { GameEndpointsService } from './game-endpoints.service';

describe('GameEndpointsService', () => {
  let service: GameEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEndpointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
