import { Test, TestingModule } from '@nestjs/testing';
import { FanNoteService } from './fan-note.service';

describe('FanNoteService', () => {
  let service: FanNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FanNoteService],
    }).compile();

    service = module.get<FanNoteService>(FanNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
