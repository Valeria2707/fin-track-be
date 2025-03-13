import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { IAiQuery } from './interface/ai-query';
import { ResponseSendQueryDto } from './dto';

@Injectable()
export class AiQueriesService {
  private readonly AI_API_URL: string;
  private readonly API_KEY: string;
  private readonly logger = new Logger(AiQueriesService.name);
  constructor(
    @Inject('PG_CLIENT') private readonly client: Client,
    private readonly configService: ConfigService,
  ) {
    this.AI_API_URL = this.configService.get<string>('AI_API_URL', '');
    this.API_KEY = this.configService.get<string>('AI_API_KEY', '');
  }

  async sendQuery(userId: number, userMessage: string, context: Record<string, unknown>): Promise<ResponseSendQueryDto> {
    const payload = {
      model: 'jamba-1.5-large',
      messages: [
        { role: 'system', content: 'You are a financial advisor.' },
        { role: 'user', content: userMessage },
      ],
      documents: [
        {
          name: 'financial_data',
          content: JSON.stringify(context),
          type: 'text',
        },
      ],
      n: 1,
      max_tokens: 2048,
      temperature: 0.4,
      top_p: 1,
      stop: [],
      response_format: { type: 'text' },
    };

    try {
      const response = await fetch(this.AI_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`AI API Error: ${response.status} - ${errorText}`);
        throw new HttpException(`AI API Error: ${response.statusText}`, response.status);
      }

      const data = await response.json();

      if (!data.choices || data.choices.length === 0) {
        this.logger.warn(`AI API returned no choices for userId: ${userId}`);
        throw new HttpException('AI API did not return any choices.', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const completionText = data.choices[0]?.message?.content;
      await this.saveToDatabase(userId, userMessage, completionText);

      if (!completionText) {
        this.logger.warn(`Empty AI response for userId: ${userId}`);
        throw new HttpException('Completion message content is undefined or empty.', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return completionText;
    } catch (error) {
      this.logger.error(`Fetch failed for userId: ${userId}, Error: ${error.message}`);
      throw new HttpException(`Fetch failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async saveToDatabase(userId: number, query: string, response: string): Promise<void> {
    const date = new Date().toISOString();
    try {
      await this.client.query('INSERT INTO ai_queries (user_id, query, response, date) VALUES ($1, $2, $3, $4)', [userId, query, response, date]);
    } catch (error) {
      this.logger.error(`Database save failed for userId: ${userId}, Error: ${error.message}`);
      throw new HttpException('Failed to save data to the database', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllQueries(): Promise<IAiQuery[]> {
    try {
      const result = await this.client.query('SELECT * FROM ai_queries ORDER BY date DESC');
      return result.rows;
    } catch (error) {
      this.logger.error(`Error retrieving data from database: ${error.message}`);
      throw new HttpException('Failed to retrieve data from the database', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
