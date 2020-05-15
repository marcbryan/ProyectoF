import { TestBed } from '@angular/core/testing';

import { AuthBusinessService } from './auth-business.service';

describe('AuthBusinessService', () => {
  let service: AuthBusinessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthBusinessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
