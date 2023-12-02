import { TestBed } from '@angular/core/testing';

import { PredictionViewModelService } from './prediction-view-model.service';

describe('PredictionViewModelService', () => {
  let service: PredictionViewModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredictionViewModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
