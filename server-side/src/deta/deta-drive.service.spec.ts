import { Test, TestingModule } from '@nestjs/testing';
import { DetaDriveService } from './deta-drive.service';

describe('DetaDriveService', () => {
  let service: DetaDriveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetaDriveService],
    }).compile();

    service = module.get<DetaDriveService>(DetaDriveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
