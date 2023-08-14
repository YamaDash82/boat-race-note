import { Test, TestingModule } from '@nestjs/testing';
import { DetaBaseService } from './deta-base.service';
import { ConfigModule } from '@nestjs/config';

describe('DetaBaseService', () => {
  let service: DetaBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(), 
      ], 
      providers: [DetaBaseService],
    }).compile();

    //service = module.get<DetaBaseService>(DetaBaseService);
    service = new DetaBaseService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
