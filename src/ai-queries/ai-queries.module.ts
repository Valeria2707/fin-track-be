import { Module } from '@nestjs/common';
import { AiQueriesService } from './ai-queries.service';
import { AiQueriesController } from './ai-queries.controller';

@Module({
  controllers: [AiQueriesController],
  providers: [AiQueriesService],
})
export class AiQueriesModule {}
