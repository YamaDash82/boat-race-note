import { TestBed } from '@angular/core/testing';

import { PredictionFormService } from './prediction-form.service';

describe('PredictionFormService', () => {
  let service: PredictionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredictionFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
