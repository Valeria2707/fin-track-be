import { Test, TestingModule } from '@nestjs/testing';
import { AiQueriesController } from './ai-queries.controller';
import { AiQueriesService } from './ai-queries.service';

describe('AiQueriesController', () => {
  let controller: AiQueriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiQueriesController],
      providers: [AiQueriesService],
    }).compile();

    controller = module.get<AiQueriesController>(AiQueriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
