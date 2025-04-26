import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AiQueriesService } from './ai-queries.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseGetQueriesDto, ResponseSendQueryDto, SendQueryDto } from './dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/guards/access-token.guard';

@UseGuards(AccessTokenGuard)
@ApiTags('Ai-Queries')
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
  @Post()
  async sendQuery(@Req() req: Request, @Body() sendQueryDto: SendQueryDto) {
    const userId = req.user['sub'];
    const { message } = sendQueryDto;

    const response = await this.aiQueriesService.sendQuery(userId, message);

    return { response };
  }

  @ApiOperation({ summary: 'Get all queries.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseGetQueriesDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get()
  async getAllQueries(@Req() req: Request) {
    const userId = req.user['sub'];
    return await this.aiQueriesService.getAllQueries(userId);
  }
}
