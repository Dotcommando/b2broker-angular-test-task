import { TestBed } from '@angular/core/testing';

import { PseudoSocketService } from './pseudo-socket.service';

describe('PseudoSocketService', () => {
  let service: PseudoSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PseudoSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
