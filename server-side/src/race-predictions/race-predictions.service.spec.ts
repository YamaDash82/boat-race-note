import { Test, TestingModule } from '@nestjs/testing';
import { RacePredictionsService } from './race-predictions.service';
import { DetaModule } from 'src/deta/deta.module';
import { ConfigModule } from '@nestjs/config';
import { DetaBaseService } from 'src/deta/deta-base.service';

describe('RacePredictionsService', () => {
  let service: RacePredictionsService;

  beforeEach(async () => {
    console.log(`初期化`)
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(), 
        DetaModule, 
      ], 
      providers: [
        RacePredictionsService, 
        { provide: DetaBaseService, useValue: new DetaBaseService() }, 
      ],
    }).compile();

    service = module.get<RacePredictionsService>(RacePredictionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
