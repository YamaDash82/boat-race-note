import { Test, TestingModule } from '@nestjs/testing';
import { DetaBaseService } from './deta-base.service';

describe('DetaBaseService', () => {
  let service: DetaBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetaBaseService],
    }).compile();

    service = module.get<DetaBaseService>(DetaBaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
