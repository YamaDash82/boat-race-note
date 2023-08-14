import { Test, TestingModule } from '@nestjs/testing';
import { RacePredictionsController } from './race-predictions.controller';

describe('RacePredictionsController', () => {
  let controller: RacePredictionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RacePredictionsController],
    }).compile();

    controller = module.get<RacePredictionsController>(RacePredictionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
