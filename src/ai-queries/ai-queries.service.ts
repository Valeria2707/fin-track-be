import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiQuery } from './entity/ai-query';
import OpenAI from 'openai';
import { TransactionService } from 'src/transaction/transaction.service';
import { getMonthRange } from 'src/utils/date';
import { buildTransactionContext } from 'src/utils/context';

@Injectable()
export class AiQueriesService {
  constructor(
    private readonly openai: OpenAI,
    @InjectRepository(AiQuery)
    private readonly aiQueryRepository: Repository<AiQuery>,
    private readonly transactionService: TransactionService,
  ) {}

  async sendQuery(userId: string, userMessage: string): Promise<string> {
    const [currentMonthRange, previousMonthRange] = [getMonthRange(0), getMonthRange(-1)];

    const [currentTransactions, previousTransactions] = await Promise.all([
      this.transactionService.findAll(userId, undefined, undefined, currentMonthRange.fromDate, currentMonthRange.toDate, 1, 9999),
      this.transactionService.findAll(userId, undefined, undefined, previousMonthRange.fromDate, previousMonthRange.toDate, 1, 9999),
    ]);

    const context = {
      currentMonth: buildTransactionContext(currentTransactions.data),
      previousMonth: buildTransactionContext(previousTransactions.data),
    };

    const contextString = JSON.stringify(context);

    const completion = await this.openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a financial advisor. Use the following user data:\n${contextString}`,
        },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.4,
      max_tokens: Number(process.env.OPENAI_MAX_TOKENS),
    });

    const answer = completion.choices[0].message?.content ?? '';

    await this.aiQueryRepository.save(
      this.aiQueryRepository.create({
        userId,
        query: userMessage,
        response: answer,
      }),
    );

    return answer;
  }

  async getAllQueries(userId: string): Promise<AiQuery[]> {
    return await this.aiQueryRepository.find({
      where: { userId },
      order: { date: 'DESC' },
      take: 5,
    });
  }
}
