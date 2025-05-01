import { Module } from '@nestjs/common';
import { AiQueriesService } from './ai-queries.service';
import { AiQueriesController } from './ai-queries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiQuery } from './entity/ai-query';
import { OpenAIProvider } from 'src/openai/openai.provider';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [TypeOrmModule.forFeature([AiQuery]), TransactionModule],
  controllers: [AiQueriesController],
  providers: [AiQueriesService, OpenAIProvider],
  exports: [AiQueriesService],
})
export class AiQueriesModule {}
