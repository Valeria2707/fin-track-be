// src/openai/openai.provider.ts
import { OpenAI } from 'openai';
import { ConfigService } from '@nestjs/config';

export const OpenAIProvider = {
  provide: OpenAI,
  useFactory: (config: ConfigService) =>
    new OpenAI({
      apiKey: config.get<string>('OPENAI_API_KEY'),
    }),
  inject: [ConfigService],
};
