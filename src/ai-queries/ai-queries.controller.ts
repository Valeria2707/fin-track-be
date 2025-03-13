import { Body, Controller, Get, Post } from '@nestjs/common';
import { AiQueriesService } from './ai-queries.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ResponseGetQueriesDto,
  ResponseSendQueryDto,
  SendQueryDto,
} from './dto';

@ApiTags('Ai-Gueries')
@Controller('ai-queries')
export class AiQueriesController {
  constructor(private readonly aiQueriesService: AiQueriesService) {}

  @ApiOperation({ summary: 'Send query.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseSendQueryDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('query')
  async sendQuery(@Body() sendQueryDto: SendQueryDto) {
    const { userId, message, context } = sendQueryDto;

    return {
      response: await this.aiQueriesService.sendQuery(userId, message, context),
    };
  }

  @ApiOperation({ summary: 'Get all queries.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseGetQueriesDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get()
  async getAllQueries() {
    return await this.aiQueriesService.getAllQueries();
  }
}
