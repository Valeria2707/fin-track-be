import { Test, TestingModule } from '@nestjs/testing';
import { AiQueriesService } from './ai-queries.service';

describe('AiQueriesService', () => {
  let service: AiQueriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiQueriesService],
    }).compile();

    service = module.get<AiQueriesService>(AiQueriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
